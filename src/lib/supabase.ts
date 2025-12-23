// src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://nmhkkelxeswoucqcvnos.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5taGtrZWx4ZXN3b3VjcWN2bm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MzY0NjksImV4cCI6MjA3NTUxMjQ2OX0.8J4X5xGCnNfttLHueT6OH7HV0WJeY2_jVMgKRH1zEdc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
