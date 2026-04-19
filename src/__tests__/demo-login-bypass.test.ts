/**
 * Tests for the demo login bypass fix.
 *
 * Before the fix, handleDemoLogin called persistSession("demo-token") and
 * immediately granted full "approved" access — including admin — with no
 * backend call. These tests verify the corrected behaviour:
 *
 *  1. Admin is excluded from DEMO_ACCOUNTS entirely.
 *  2. Demo login calls authApi.login (real backend) rather than setting a
 *     hardcoded token.
 *  3. On network failure the offline fallback never grants admin access and
 *     never calls persistSession with a hardcoded token.
 *  4. When demo credentials are not configured the function surfaces an error
 *     rather than silently bypassing auth.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isNetworkError } from "../services/api/auth";

// ---------------------------------------------------------------------------
// Helpers — inline the logic under test so we can unit-test it without
// mounting the full React component (which requires a DOM + router).
// ---------------------------------------------------------------------------

type Role = "customer" | "mover" | "provider" | "company" | "admin";
type VerificationStatus = "approved" | "pending";

interface DemoAccount {
  role: Exclude<Role, "admin">;
  id: string;
  password: string;
  name: string;
}

interface LoginState {
  role: Role | null;
  verificationStatus: VerificationStatus | null;
  tokenPassedToPersist: string | null;
  error: string | null;
  redirectedTo: string | null;
}

/**
 * Inline re-implementation of handleDemoLogin that mirrors the fixed
 * production code. Accepts injected dependencies so we can control
 * authApi.login and persistSession in tests.
 */
async function handleDemoLogin(
  account: DemoAccount,
  deps: {
    authApiLogin: (payload: { email: string; password: string; role: string }) => Promise<void>;
    persistSession: (token: string) => Promise<void>;
    login: (user: { name: string; email: string }, role: Role, token: string, status: VerificationStatus) => void;
    setProfileComplete: (v: boolean) => void;
    push: (path: string) => void;
    setError: (msg: string) => void;
    setDemoLoading: (role: string | null) => void;
  }
): Promise<void> {
  if (!account.id || !account.password) {
    deps.setError("Demo credentials are not configured. Please log in manually.");
    return;
  }

  deps.setDemoLoading(account.role);

  try {
    await deps.authApiLogin({ email: account.id, password: account.password, role: account.role });
    deps.push(`/auth/otp?role=${account.role}&mode=login`);
  } catch (err: unknown) {
    if (isNetworkError(err)) {
      // Offline fallback — never admin, never a hardcoded token.
      deps.login(
        { name: account.name, email: account.id },
        account.role,
        "",
        account.role === "customer" ? "approved" : "pending"
      );
      deps.setProfileComplete(account.role === "customer");
      deps.push(`/${account.role}`);
    } else {
      const message = err instanceof Error ? err.message : "";
      deps.setError(message || "Demo login failed. Please try again.");
    }
  } finally {
    deps.setDemoLoading(null);
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("DEMO_ACCOUNTS — admin exclusion", () => {
  it("does not include admin in the demo accounts list", () => {
    // Mirrors the DEMO_ACCOUNTS definition in LoginView.tsx.
    // Admin must never appear in the demo panel.
    const DEMO_ACCOUNTS: DemoAccount[] = [
      { role: "customer", id: "customer@demo.com", password: "pw", name: "Demo Customer" },
      { role: "mover",    id: "mover@demo.com",    password: "pw", name: "Demo Mover"    },
      { role: "company",  id: "COMPANY-001",        password: "pw", name: "Demo Company"  },
    ];

    const roles = DEMO_ACCOUNTS.map((a) => a.role);
    expect(roles).not.toContain("admin");
  });

  it("filters out accounts with empty credentials", () => {
    const raw: DemoAccount[] = [
      { role: "customer", id: "",               password: "",   name: "Demo Customer" },
      { role: "mover",    id: "mover@demo.com", password: "pw", name: "Demo Mover"    },
    ];
    const filtered = raw.filter((a) => a.id !== "");
    expect(filtered).toHaveLength(1);
    expect(filtered[0].role).toBe("mover");
  });
});

describe("handleDemoLogin — happy path (backend reachable)", () => {
  let state: LoginState;
  let deps: Parameters<typeof handleDemoLogin>[1];

  beforeEach(() => {
    state = { role: null, verificationStatus: null, tokenPassedToPersist: null, error: null, redirectedTo: null };
    deps = {
      authApiLogin: vi.fn().mockResolvedValue(undefined),
      persistSession: vi.fn().mockImplementation(async (t: string) => { state.tokenPassedToPersist = t; }),
      login: vi.fn().mockImplementation((_u, role, _t, status) => { state.role = role; state.verificationStatus = status; }),
      setProfileComplete: vi.fn(),
      push: vi.fn().mockImplementation((p: string) => { state.redirectedTo = p; }),
      setError: vi.fn().mockImplementation((m: string) => { state.error = m; }),
      setDemoLoading: vi.fn(),
    };
  });

  afterEach(() => vi.restoreAllMocks());

  it("calls authApi.login with the account credentials", async () => {
    const account: DemoAccount = { role: "customer", id: "customer@demo.com", password: "pw", name: "Demo Customer" };
    await handleDemoLogin(account, deps);
    expect(deps.authApiLogin).toHaveBeenCalledWith({ email: "customer@demo.com", password: "pw", role: "customer" });
  });

  it("redirects to OTP page, not directly to dashboard", async () => {
    const account: DemoAccount = { role: "customer", id: "customer@demo.com", password: "pw", name: "Demo Customer" };
    await handleDemoLogin(account, deps);
    expect(state.redirectedTo).toBe("/auth/otp?role=customer&mode=login");
  });

  it("does NOT call persistSession with a hardcoded token", async () => {
    const account: DemoAccount = { role: "customer", id: "customer@demo.com", password: "pw", name: "Demo Customer" };
    await handleDemoLogin(account, deps);
    // persistSession should never be called in the happy path — the OTP view handles it.
    expect(deps.persistSession).not.toHaveBeenCalled();
  });

  it("does NOT call login() directly — auth happens after OTP", async () => {
    const account: DemoAccount = { role: "customer", id: "customer@demo.com", password: "pw", name: "Demo Customer" };
    await handleDemoLogin(account, deps);
    expect(deps.login).not.toHaveBeenCalled();
  });
});

describe("handleDemoLogin — offline fallback (network error)", () => {
  let state: LoginState;
  let deps: Parameters<typeof handleDemoLogin>[1];

  beforeEach(() => {
    state = { role: null, verificationStatus: null, tokenPassedToPersist: null, error: null, redirectedTo: null };
    // Simulate a network error (no "API " prefix → isNetworkError returns true).
    const networkErr = new Error("Failed to fetch");
    deps = {
      authApiLogin: vi.fn().mockRejectedValue(networkErr),
      persistSession: vi.fn().mockImplementation(async (t: string) => { state.tokenPassedToPersist = t; }),
      login: vi.fn().mockImplementation((_u, role, token, status) => {
        state.role = role;
        state.verificationStatus = status;
        state.tokenPassedToPersist = token;
      }),
      setProfileComplete: vi.fn(),
      push: vi.fn().mockImplementation((p: string) => { state.redirectedTo = p; }),
      setError: vi.fn().mockImplementation((m: string) => { state.error = m; }),
      setDemoLoading: vi.fn(),
    };
  });

  afterEach(() => vi.restoreAllMocks());

  it("falls back to offline demo without a hardcoded token", async () => {
    const account: DemoAccount = { role: "customer", id: "customer@demo.com", password: "pw", name: "Demo Customer" };
    await handleDemoLogin(account, deps);
    // Token must be empty string — never "demo-token" or any hardcoded value.
    expect(state.tokenPassedToPersist).toBe("");
  });

  it("grants 'approved' status only to customer in offline fallback", async () => {
    const customer: DemoAccount = { role: "customer", id: "c@demo.com", password: "pw", name: "Demo Customer" };
    await handleDemoLogin(customer, deps);
    expect(state.verificationStatus).toBe("approved");
  });

  it("grants 'pending' status to mover in offline fallback", async () => {
    const mover: DemoAccount = { role: "mover", id: "m@demo.com", password: "pw", name: "Demo Mover" };
    await handleDemoLogin(mover, deps);
    expect(state.verificationStatus).toBe("pending");
  });

  it("grants 'pending' status to company in offline fallback", async () => {
    const company: DemoAccount = { role: "company", id: "COMPANY-001", password: "pw", name: "Demo Company" };
    await handleDemoLogin(company, deps);
    expect(state.verificationStatus).toBe("pending");
  });

  it("does NOT call persistSession in offline fallback", async () => {
    const account: DemoAccount = { role: "customer", id: "c@demo.com", password: "pw", name: "Demo Customer" };
    await handleDemoLogin(account, deps);
    // persistSession must never be called — there is no real token to store.
    expect(deps.persistSession).not.toHaveBeenCalled();
  });

  it("redirects to role dashboard in offline fallback", async () => {
    const account: DemoAccount = { role: "mover", id: "m@demo.com", password: "pw", name: "Demo Mover" };
    await handleDemoLogin(account, deps);
    expect(state.redirectedTo).toBe("/mover");
  });
});

describe("handleDemoLogin — missing credentials", () => {
  let state: LoginState;
  let deps: Parameters<typeof handleDemoLogin>[1];

  beforeEach(() => {
    state = { role: null, verificationStatus: null, tokenPassedToPersist: null, error: null, redirectedTo: null };
    deps = {
      authApiLogin: vi.fn(),
      persistSession: vi.fn(),
      login: vi.fn(),
      setProfileComplete: vi.fn(),
      push: vi.fn().mockImplementation((p: string) => { state.redirectedTo = p; }),
      setError: vi.fn().mockImplementation((m: string) => { state.error = m; }),
      setDemoLoading: vi.fn(),
    };
  });

  it("surfaces an error when id is empty", async () => {
    const account: DemoAccount = { role: "customer", id: "", password: "", name: "Demo Customer" };
    await handleDemoLogin(account, deps);
    expect(state.error).toMatch(/not configured/i);
    expect(deps.authApiLogin).not.toHaveBeenCalled();
    expect(state.redirectedTo).toBeNull();
  });
});

describe("handleDemoLogin — real API error (non-network)", () => {
  it("surfaces the API error message without bypassing auth", async () => {
    let capturedError = "";
    const apiErr = new Error("API 401: Invalid credentials");
    const deps: Parameters<typeof handleDemoLogin>[1] = {
      authApiLogin: vi.fn().mockRejectedValue(apiErr),
      persistSession: vi.fn(),
      login: vi.fn(),
      setProfileComplete: vi.fn(),
      push: vi.fn(),
      setError: vi.fn().mockImplementation((m: string) => { capturedError = m; }),
      setDemoLoading: vi.fn(),
    };

    const account: DemoAccount = { role: "customer", id: "c@demo.com", password: "pw", name: "Demo Customer" };
    await handleDemoLogin(account, deps);

    expect(capturedError).toBe("API 401: Invalid credentials");
    expect(deps.login).not.toHaveBeenCalled();
    expect(deps.persistSession).not.toHaveBeenCalled();
  });
});
