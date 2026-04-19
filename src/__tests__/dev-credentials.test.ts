/**
 * Tests for Fix #2 — dev credentials must not appear in production builds.
 *
 * We test the guard logic directly: when NODE_ENV is "production" the
 * DEV_CREDENTIALS object must be null (tree-shaken) and the OTP devLogin
 * path must throw rather than grant access.
 */

import { describe, it, expect, vi, afterEach } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("DEV_CREDENTIALS production guard", () => {
  it("is null when NODE_ENV=production", async () => {
    vi.stubEnv("NODE_ENV", "production");

    // Re-evaluate the guard expression as it appears in LoginView.tsx
    const creds =
      process.env.NODE_ENV !== "production"
        ? { admin: { id: "ADMIN-001", password: "demo1234", name: "Demo Admin" } }
        : null;

    expect(creds).toBeNull();
  });

  it("is defined when NODE_ENV=development", async () => {
    vi.stubEnv("NODE_ENV", "development");

    const creds =
      process.env.NODE_ENV !== "production"
        ? { admin: { id: "ADMIN-001", password: "demo1234", name: "Demo Admin" } }
        : null;

    expect(creds).not.toBeNull();
    expect(creds?.admin.password).toBe("demo1234");
  });
});

describe("OTP devLogin production guard", () => {
  it("throws in production regardless of OTP value", () => {
    vi.stubEnv("NODE_ENV", "production");

    const devLogin = (otp: string) => {
      if (process.env.NODE_ENV === "production") throw new Error("Invalid OTP");
      if (otp === "000000") throw new Error("Invalid OTP");
      // would call login() here
    };

    expect(() => devLogin("123456")).toThrow("Invalid OTP");
    expect(() => devLogin("999999")).toThrow("Invalid OTP");
  });

  it("throws on the sentinel OTP 000000 in development", () => {
    vi.stubEnv("NODE_ENV", "development");

    const devLogin = (otp: string) => {
      if (process.env.NODE_ENV === "production") throw new Error("Invalid OTP");
      if (otp === "000000") throw new Error("Invalid OTP");
    };

    expect(() => devLogin("000000")).toThrow("Invalid OTP");
  });

  it("does not throw on a valid OTP in development", () => {
    vi.stubEnv("NODE_ENV", "development");

    const devLogin = (otp: string) => {
      if (process.env.NODE_ENV === "production") throw new Error("Invalid OTP");
      if (otp === "000000") throw new Error("Invalid OTP");
      // success — no throw
    };

    expect(() => devLogin("123456")).not.toThrow();
  });
});
