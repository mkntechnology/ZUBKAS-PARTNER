import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wnjzjbqvphhqlovjqmwp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduanpqYnF2cGhocWxvdmpxbXdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MDk4NjAsImV4cCI6MjEwNzI4NTg2MH0.iDxVyivHtbmwxnz5w6qvagJy_Tp30Yfdqj-SzhPtLwk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
