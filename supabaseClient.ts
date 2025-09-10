import { createClient } from '@supabase/supabase-js';

// Nahraď následující hodnoty svými klíči
const supabaseUrl = 'https://fnewniipdwtloqqyzqni.supabase.co';  // Tvoje Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuZXduaWlwZHd0bG9xcXl6cW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjM4NTEsImV4cCI6MjA3MjkzOTg1MX0.kGL6ZUceZdc2oO8hSUgUxEkQbwHmfruNa3BPkF56r08';  // Tvoje veřejné klíče (anon nebo servisní klíč)

export const supabase = createClient(supabaseUrl, supabaseKey);
