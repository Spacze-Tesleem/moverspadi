// Route handler: manages the httpOnly session cookie.
//
// POST /api/auth/session  — set cookie after OTP verification
// DELETE /api/auth/session — clear cookie on logout
//
// The token itself is never exposed to JavaScript running in the page;
// it lives only in the httpOnly cookie and is forwarded to the backend
// via server-side API calls or Next.js rewrites.

import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "mp_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}

/** POST — store the session token in an httpOnly cookie. */
export async function POST(req: NextRequest) {
  let body: { token?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const token = body?.token;
  if (typeof token !== "string" || token.trim() === "") {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, cookieOptions(MAX_AGE));
  return res;
}

/** DELETE — clear the session cookie on logout. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", cookieOptions(0));
  return res;
}
