import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client public — utilisé côté navigateur, soumis au RLS
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client admin — utilisé uniquement côté serveur (controllers, auth adapter)
// Bypasse le RLS, ne jamais exposer côté client
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
