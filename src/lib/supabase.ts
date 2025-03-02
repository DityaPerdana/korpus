import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Log Supabase connection info (without exposing keys)
const hasUrl = !!supabaseUrl;
const hasKey = !!supabaseAnonKey;
console.log(
  `Supabase connection info - Has URL: ${hasUrl}, Has Key: ${hasKey}`,
);

if (!hasUrl || !hasKey) {
  console.error(
    "Supabase credentials are missing. Please check your environment variables.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
