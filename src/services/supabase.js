import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Tables we'll use:
// - memories (posts)
// - reactions
// - tributes
// - donations
// - gallery
// - program_schedule
// - biography