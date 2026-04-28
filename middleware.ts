// Next.js Edge Middleware — server-side route protection.
//
// Runs before any page or API route is rendered. Checks for the httpOnly
// session cookie on all protected portal routes and redirects unauthenticated
// requests to /auth/login before any page content is served.
//
// This is the authoritative auth gate. The client-side useRequireAuth hook
// is a UX layer only (prevents flash of protected content) and must not be
// relied upon as a security boundary.

import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "mp_session";

// Routes that require an authenticated session.
// Matched as path prefixes — any sub-route is also protected.
const PROTECTED_PREFIXES = [
  "/admin",
  "/customer",
  "/mover",
  "/provider",
  "/company",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const isAuthenticated = typeof token === "string" && token.trim().length > 0;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  // Unauthenticated request to a protected route → redirect to login.
  // Auth routes (/auth/*) are always accessible — a cookie alone is not a
  // reliable signal of a valid session (it may be stale/expired). The
  // client-side store is the authoritative source for auth state.
  if (isProtected && !isAuthenticated) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    // Preserve the intended destination so the login page can redirect back.
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals, static files, and the
  // session API route itself (which manages the cookie and must be reachable
  // without a session).
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth/session).*)",
  ],
};
