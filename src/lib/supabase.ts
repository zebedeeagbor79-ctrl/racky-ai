import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabasePublishableKey = 'YOUR_SUPABASE_PUBLISHABLE_KEY';

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);
