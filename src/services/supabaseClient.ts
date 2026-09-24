import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 'https://uqqhsuoudhksqjlnctpi.supabase.co';
const SUPABASE_ANON_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const isSupabaseConfigured = () => {
  if (typeof import.meta === 'undefined' || !import.meta.env) return false;
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const enableCloud = import.meta.env.VITE_ENABLE_SUPABASE === 'true';

  return (
    enableCloud &&
    Boolean(url) &&
    Boolean(key) &&
    url !== 'YOUR_SUPABASE_URL' &&
    key !== 'YOUR_SUPABASE_ANON_KEY' &&
    !key.includes('placeholder')
  );
};
