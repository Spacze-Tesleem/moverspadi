/**
 * Tests for Fix #1 (Next.js version) and Fix #3 (sessionClient helpers).
 *
 * Fix #1 — verifies the installed Next.js version is ≥ 16.2.4 (the first
 * release that patches the HTTP request smuggling and CSRF CVEs).
 *
 * Fix #3 — verifies persistSession and clearSession call the correct
 * Route Handler endpoints with the correct method and payload.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ── Fix #1: Next.js version check ────────────────────────────────────────────

describe("Next.js version", () => {
  it("is at least 16.2.4 (patches HTTP smuggling + CSRF CVEs)", async () => {
    const { version } = await import("next/package.json");

    const [major, minor, patch] = version.split(".").map(Number);

    const isPatched =
      major > 16 ||
      (major === 16 && minor > 2) ||
      (major === 16 && minor === 2 && patch >= 4);

    expect(
      isPatched,
      `Next.js ${version} is still in the vulnerable range (< 16.2.4)`
    ).toBe(true);
  });
});

// ── Fix #3: sessionClient helpers ────────────────────────────────────────────

describe("persistSession", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("POSTs the token to /api/auth/session", async () => {
    const { persistSession } = await import("../lib/sessionClient");
    await persistSession("my-jwt-token");

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/auth/session");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ token: "my-jwt-token" });
  });

  it("throws when the server returns a non-ok response", async () => {
    fetchMock.mockResolvedValue({ ok: false });
    const { persistSession } = await import("../lib/sessionClient");
    await expect(persistSession("bad")).rejects.toThrow("Failed to persist session");
  });
});

describe("clearSession", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends DELETE to /api/auth/session", async () => {
    const { clearSession } = await import("../lib/sessionClient");
    await clearSession();

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/auth/session");
    expect(init.method).toBe("DELETE");
  });
});
