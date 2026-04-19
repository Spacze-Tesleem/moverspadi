/**
 * Tests for /api/auth/session Route Handler (Fix #3 — httpOnly cookie).
 *
 * Verifies that:
 *  - POST sets an httpOnly cookie containing the token
 *  - POST rejects missing / non-string tokens
 *  - DELETE clears the cookie (maxAge = 0)
 */

import { describe, it, expect } from "vitest";
import { POST, DELETE } from "../../app/api/auth/session/route";
import { NextRequest } from "next/server";

function makeRequest(method: string, body?: unknown): NextRequest {
  return new NextRequest("http://localhost/api/auth/session", {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

describe("POST /api/auth/session", () => {
  it("sets an httpOnly cookie when a valid token is provided", async () => {
    const req = makeRequest("POST", { token: "test-jwt-abc123" });
    const res = await POST(req);

    expect(res.status).toBe(200);

    const setCookie = res.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("mp_session=test-jwt-abc123");
    expect(setCookie.toLowerCase()).toContain("httponly");
    expect(setCookie.toLowerCase()).toContain("samesite=strict");
  });

  it("returns 400 when token is missing", async () => {
    const req = makeRequest("POST", {});
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when token is an empty string", async () => {
    const req = makeRequest("POST", { token: "   " });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when token is not a string", async () => {
    const req = makeRequest("POST", { token: 12345 });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 on malformed JSON body", async () => {
    const req = new NextRequest("http://localhost/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/auth/session", () => {
  it("clears the session cookie (maxAge=0)", async () => {
    const res = await DELETE();

    expect(res.status).toBe(200);

    const setCookie = res.headers.get("set-cookie") ?? "";
    // Cookie value should be empty and max-age should be 0
    expect(setCookie).toContain("mp_session=");
    expect(setCookie.toLowerCase()).toMatch(/max-age=0/);
    expect(setCookie.toLowerCase()).toContain("httponly");
  });
});
