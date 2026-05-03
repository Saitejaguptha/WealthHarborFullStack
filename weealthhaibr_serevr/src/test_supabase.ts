import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing connection to:', supabaseUrl);
  const { data, error } = await supabase.from('mutual_funds').select('*').limit(5);
  if (error) {
    console.error('Error fetching mutual_funds:', error);
  } else {
    console.log('Successfully fetched mutual_funds count:', data.length);
    console.log('Data sample:', JSON.stringify(data, null, 2));
  }
}

test();
