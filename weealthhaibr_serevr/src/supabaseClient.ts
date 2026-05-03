import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase credentials. Make sure SUPABASE_URL and SUPABASE_KEY are set in your .env file.'
  );
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
