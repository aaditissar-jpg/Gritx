
import { createClient } from '@supabase/supabase-js';

// Derived from the provided JWT ref: voqsufshcyzzasuyvmsr
const SUPABASE_URL = 'https://voqsufshcyzzasuyvmsr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvcXN1ZnNoY3l6emFzdXl2bXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MTUyOTUsImV4cCI6MjA3OTI5MTI5NX0.qBNCrnhOA-SpvzCpxUzTURRd6PA372lIcXIt9H32yp0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
