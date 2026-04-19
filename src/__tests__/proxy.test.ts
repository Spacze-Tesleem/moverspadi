/**
 * Tests for proxy.ts — server-side route protection.
 *
 * Verifies that:
 *  - Protected portal routes redirect to /auth/login when the session cookie is absent
 *  - Protected routes are served normally when the session cookie is present
 *  - Auth routes redirect authenticated users away to /
 *  - Public routes (marketing, API) are always served without a cookie
 *  - The ?next= parameter is preserved on login redirects
 */

import { describe, it, expect } from "vitest";
import { middleware } from "../../proxy";
import { NextRequest } from "next/server";

const BASE = "http://localhost:3000";

function makeRequest(pathname: string, sessionToken?: string): NextRequest {
  const req = new NextRequest(`${BASE}${pathname}`);
  if (sessionToken) {
    req.cookies.set("mp_session", sessionToken);
  }
  return req;
}

// ── Protected routes — unauthenticated ───────────────────────────────────────

describe("protected routes without a session cookie", () => {
  const protectedPaths = [
    "/admin",
    "/admin/users",
    "/customer",
    "/customer/book",
    "/mover",
    "/mover/onboarding",
    "/provider",
    "/provider/onboarding",
    "/company",
    "/company/onboarding",
  ];

  for (const path of protectedPaths) {
    it(`redirects ${path} → /auth/login`, () => {
      const req = makeRequest(path);
      const res = middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location") ?? "";
      expect(location).toContain("/auth/login");
    });

    it(`preserves ?next=${path} on redirect from ${path}`, () => {
      const req = makeRequest(path);
      const res = middleware(req);

      const location = res.headers.get("location") ?? "";
      expect(location).toContain(`next=${encodeURIComponent(path)}`);
    });
  }
});

// ── Protected routes — authenticated ─────────────────────────────────────────

describe("protected routes with a valid session cookie", () => {
  const protectedPaths = [
    "/admin",
    "/customer",
    "/mover",
    "/provider",
    "/company",
  ];

  for (const path of protectedPaths) {
    it(`serves ${path} when session cookie is present`, () => {
      const req = makeRequest(path, "valid-jwt-token");
      const res = middleware(req);

      // NextResponse.next() has no Location header and status 200
      expect(res.headers.get("location")).toBeNull();
      expect(res.status).toBe(200);
    });
  }
});

// ── Auth routes — authenticated user ─────────────────────────────────────────

describe("auth routes with an existing session cookie", () => {
  const authPaths = ["/auth/login", "/auth/signup", "/auth/role"];

  for (const path of authPaths) {
    it(`redirects authenticated user away from ${path} → /`, () => {
      const req = makeRequest(path, "valid-jwt-token");
      const res = middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location") ?? "";
      expect(location).toMatch(/\/$/); // ends with /
    });
  }
});

// ── Auth routes — unauthenticated user ───────────────────────────────────────

describe("auth routes without a session cookie", () => {
  const authPaths = ["/auth/login", "/auth/signup", "/auth/role"];

  for (const path of authPaths) {
    it(`serves ${path} to unauthenticated users`, () => {
      const req = makeRequest(path);
      const res = middleware(req);

      expect(res.headers.get("location")).toBeNull();
      expect(res.status).toBe(200);
    });
  }
});

// ── Public routes ─────────────────────────────────────────────────────────────

describe("public routes", () => {
  const publicPaths = ["/", "/about", "/contact"];

  for (const path of publicPaths) {
    it(`serves ${path} without a session cookie`, () => {
      const req = makeRequest(path);
      const res = middleware(req);

      expect(res.headers.get("location")).toBeNull();
      expect(res.status).toBe(200);
    });
  }
});

// ── Edge cases ────────────────────────────────────────────────────────────────

describe("edge cases", () => {
  it("treats an empty-string cookie value as unauthenticated", () => {
    const req = makeRequest("/admin", "");
    // Manually set an empty cookie to simulate a cleared session
    req.cookies.set("mp_session", "");
    const res = middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/auth/login");
  });

  it("treats a whitespace-only cookie value as unauthenticated", () => {
    const req = makeRequest("/customer", "   ");
    const res = middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/auth/login");
  });

  it("does not redirect /api/auth/session (cookie management endpoint)", () => {
    // The matcher excludes api/auth/session, so middleware never runs on it.
    // We test the isProtected logic directly: /api/auth/session is not in
    // PROTECTED_PREFIXES, so it passes through.
    const req = makeRequest("/api/auth/session");
    const res = middleware(req);

    expect(res.headers.get("location")).toBeNull();
    expect(res.status).toBe(200);
  });
});
