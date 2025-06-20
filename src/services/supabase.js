import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qseopcfytkhoisnfaxzk.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Test the connection
supabase.from('biography').select('*').limit(1)
  .then(({ error }) => {
    if (error) {
      console.error('Supabase connection error:', error.message);
    } else {
      console.log('Successfully connected to Supabase');
    }
  });