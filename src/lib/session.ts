// Server-side session helpers — safe to import in Server Components and
// Route Handlers. Never import this in client components.

import { cookies } from "next/headers";

const COOKIE_NAME = "mp_session";

/** Returns the raw session token from the httpOnly cookie, or null. */
export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}
