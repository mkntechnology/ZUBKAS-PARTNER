import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://motxmwklanwgmucmpijn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vdHhtd2tsYW53Z211Y21waWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNjEzODMsImV4cCI6MjEwNzYzNzM4M30.g9Y6aZpWgdnG-YZg0uUuZHxJUin-7HlTaomzG2TQP5A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
