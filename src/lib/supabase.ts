
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'PASTE_YOUR_SUPABASE_PROJECT_URL';
const supabasePublishableKey = 'PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY';

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);
