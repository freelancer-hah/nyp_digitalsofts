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
  cnicOrEmail: string,
  passwordInput: string
): Promise<{ user: User; profile?: MemberProfile } | { error: string }> {
  const cleanCnic = normalizeCnic(cnicOrEmail);
  const authEmail = cnicToAuthEmail(cnicOrEmail);

  if (isSupabaseConfigured()) {
    try {
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: passwordInput,
      });

      if (!authErr && authData?.user) {
        console.log('Supabase Auth signIn successful for:', authData.user.email);
      }
    } catch (e) {
      console.warn('Supabase Auth signIn notice:', e);
    }
  }

  let localRes = store.loginUserByCnic(cnicOrEmail, passwordInput);
  if (!localRes.success && isSupabaseConfigured()) {
    await store.fetchFromSupabase(true);
    localRes = store.loginUserByCnic(cnicOrEmail, passwordInput);
  }

  if (localRes.success && localRes.user) {
    const prof = store.getProfileByUserId(localRes.user.id || localRes.user.cnicNumber);
    return { user: localRes.user, profile: prof };
  } else {
    return { error: localRes.error || 'Invalid CNIC or password.' };
  }
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
