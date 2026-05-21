import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Throw a descriptive error instead of the cryptic Supabase one.
    // During normal Vercel builds this code is unreachable because the
    // admin layout sets dynamic = "force-dynamic" (no build-time prerender).
    // If you see this error, add NEXT_PUBLIC_SUPABASE_URL and
    // NEXT_PUBLIC_SUPABASE_ANON_KEY to your Vercel project settings.
    throw new Error(
      "Missing Supabase credentials.\n" +
      "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY\n" +
      "to your Vercel project → Settings → Environment Variables."
    );
  }

  return createBrowserClient(url, key);
}
