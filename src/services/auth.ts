import { supabase, isSupabaseConfigured } from './supabaseClient';
import { store, normalizeCnic, formatCnic } from './store';
import { User, MemberProfile, UserRole } from '../types';

export function cnicToAuthEmail(cnicOrEmail: string): string {
  if (!cnicOrEmail) return 'applicant@nypsindh.org.pk';
  const trimmed = cnicOrEmail.trim();
  if (trimmed.includes('@')) return trimmed; // Already an email
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length >= 11) {
    return `cnic.${digits}@nypsindh.org.pk`;
  }
  return `user.${trimmed.toLowerCase()}@nypsindh.org.pk`;
}

export async function signUpMemberWithSupabaseAuth(data: {
  cnicNumber: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  password?: string;
  profileData: Partial<MemberProfile>;
}): Promise<{ user: User; profile: MemberProfile } | { error: string }> {
  const cleanCnic = normalizeCnic(data.cnicNumber);
  const authEmail = (data.email && data.email.includes('@')) ? data.email.trim() : cnicToAuthEmail(cleanCnic);
  const password = data.password || '';
  let registeredAuthId: string | undefined = undefined;

  if (isSupabaseConfigured()) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: authEmail,
        password: password,
        options: {
          data: {
            full_name: data.fullName,
            cnic_number: cleanCnic,
            mobile_number: data.mobileNumber,
          },
        },
      });

      if (authError && !authError.message.includes('already registered')) {
        console.warn('Supabase Auth signUp notice:', authError.message);
      }

      if (authData?.user?.id) {
        registeredAuthId = authData.user.id;
        // Also sign in to active session
        await supabase.auth.signInWithPassword({
          email: authEmail,
          password: password,
        });
      } else {
        // If already registered or session exists
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user?.id) {
          registeredAuthId = sessionData.session.user.id;
        }
      }
    } catch (e) {
      console.warn('Supabase Auth signUp exception:', e);
    }
  }

  if (registeredAuthId) {
    data.profileData.userId = registeredAuthId;
  }

  // Create/update local profile and store state
  const profile = await store.submitMemberProfile(data.profileData as MemberProfile, password);
  const currentUser = store.getCurrentUser();

  return {
    user: currentUser || {
      id: profile.userId || profile.id,
      cnicNumber: cleanCnic,
      fullName: profile.fullName,
      email: profile.email,
      mobileNumber: profile.mobileNumber,
      role: 'MEMBER',
      createdAt: profile.submittedAt,
    },
    profile,
  };
}

export async function signInWithSupabaseAuth(
  identifier: string,
  passwordInput: string
): Promise<{ user: User; profile?: MemberProfile } | { error: string }> {
  // 1. Prioritize Cloud Authentication (Supabase Cloud DB / Auth) when configured
  if (isSupabaseConfigured()) {
    const cloudOfficer = await store.loginOfficerCloud(identifier, passwordInput);
    if (cloudOfficer) {
      const prof = store.getProfileByUserId(cloudOfficer.id || cloudOfficer.cnicNumber);
      return { user: cloudOfficer, profile: prof };
    }

    const memberRes = await store.loginMember(identifier, passwordInput);
    if (memberRes.success && memberRes.user) {
      const prof = store.getProfileByUserId(memberRes.user.id || memberRes.user.cnicNumber);
      return { user: memberRes.user, profile: prof };
    }
  }

  // 2. Local fallback check using environment variables (VITE_SUPERADMIN_PASSWORD etc.)
  const localRes = store.loginUserByCnic(identifier, passwordInput);
  if (localRes.success && localRes.user) {
    const prof = store.getProfileByUserId(localRes.user.id || localRes.user.cnicNumber);
    return { user: localRes.user, profile: prof };
  }

  return { error: 'Invalid CNIC or password. Please check your credentials.' };
}

export async function signOutSupabaseAuth() {
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase Auth signOut notice:', e);
    }
  }
  store.logoutUser();
}
