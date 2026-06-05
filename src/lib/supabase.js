import { createClient } from '@supabase/supabase-js'

// Client-side config. We ONLY ever use the publishable (anon) key here.
// The Supabase SECRET key must NEVER be referenced in client code — it would
// be bundled into the browser build and grant full, RLS-bypassing access.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Guard so the app still boots (and unit tests run) without a live project
// configured. Consumers should null-check `supabase` before use, or rely on
// AuthProvider which already does.
export const supabase =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null
