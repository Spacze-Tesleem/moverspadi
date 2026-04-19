"use client";

// Client-side wrappers around the /api/auth/session Route Handler.
// These are the only places the token crosses the JS boundary — it is
// immediately handed off to an httpOnly cookie and never stored in
// localStorage or any JS-accessible location.

/** Persist a session token in the httpOnly cookie. */
export async function persistSession(token: string): Promise<void> {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) throw new Error("Failed to persist session");
}

/** Clear the session cookie (call on logout). */
export async function clearSession(): Promise<void> {
  await fetch("/api/auth/session", { method: "DELETE" });
}
