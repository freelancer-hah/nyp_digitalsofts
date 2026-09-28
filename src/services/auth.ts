import { supabase, isSupabaseConfigured } from './supabaseClient';
import { store, normalizeCnic, formatCnic } from './store';
import { User, MemberProfile, UserRole } from '../types';

export function cnicToAuthEmail(cnicOrEmail: string): string {
  if (!cnicOrEmail) return '';
  const trimmed = cnicOrEmail.trim();
  if (trimmed.includes('@')) return trimmed; // Already an email
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length >= 11) {
    return `${digits}@auth.nypsindh.org.pk`;
  }
  return `${trimmed.toLowerCase()}@auth.nypsindh.org.pk`;
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
  const authEmail = cnicToAuthEmail(cleanCnic);
  const password = data.password || 'pass123';

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

      const authUserId = authData.user?.id;
      if (authUserId) {
        // Also sign in to active session
        await supabase.auth.signInWithPassword({
          email: authEmail,
          password: password,
        });
      }
    } catch (e) {
      console.warn('Supabase Auth signUp exception:', e);
    }
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

  const localRes = store.loginUserByCnic(cnicOrEmail, passwordInput);
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
