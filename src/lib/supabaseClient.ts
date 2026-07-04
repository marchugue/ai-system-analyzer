import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Don't throw at module scope — the questionnaire itself should still be
  // usable for local testing even if Supabase isn't configured yet. The
  // failure surfaces gracefully when saveAnalysis() is actually called.
  console.warn(
    '[supabaseClient] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. ' +
      'Report submissions will not be saved. See .env.example.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
