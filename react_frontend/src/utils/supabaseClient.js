import { createClient } from '@supabase/supabase-js';

const url = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Basic guard to aid debugging in development
if (!url || !anonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase env vars missing: REACT_APP_SUPABASE_URL and/or REACT_APP_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(url || '', anonKey || '');
