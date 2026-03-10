import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const configuredAdminEmails = import.meta.env.VITE_SUPABASE_ADMIN_EMAILS ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);
export const SUPABASE_SITE_CONTENT_ID = "main";
export const SUPABASE_SITE_MEDIA_BUCKET = "site-media";
export const supabaseAdminEmails = configuredAdminEmails
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);
export const isAllowedAdminEmail = (email: string | null | undefined) =>
  Boolean(email && supabaseAdminEmails.includes(email.trim().toLowerCase()));

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;
