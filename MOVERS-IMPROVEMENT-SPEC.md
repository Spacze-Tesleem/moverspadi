# AGENTS-IMPROVEMENT-SPEC.md

Concrete improvements to make AGENTS.md and the codebase more agent-friendly.
Each item states the problem, the fix, and the acceptance criterion.

---

## Audit Summary

### What's Good

- **Clear domain-driven structure.** `domain/` → `application/` → `infrastructure/` → `modules/` → `app/` layers are well-separated and consistently applied.
- **Thin routing shells.** `app/` pages are one-liners that delegate to `*View` components. Easy for agents to follow the pattern.
- **Domain types are framework-free.** `src/domain/` has no React or Next.js imports — safe to import anywhere.
- **Shared API client.** `apiClient` in `src/infrastructure/api/client.ts` centralises fetch, auth headers, and error handling.
- **Geocoding is isolated.** Nominatim calls are in `src/infrastructure/geocoding/nominatim.ts`, not scattered in components.
- **Utility functions are named and typed.** `cn()`, `formatNaira()`, `formatDate()`, `truncate()` are all in `src/lib/`.
- **Zustand stores are typed.** Both stores have explicit state interfaces and use `persist` consistently.
- **Map SSR guard is in place.** `MapPreview` is loaded with `dynamic(..., { ssr: false })`.

### What's Missing

1. No test suite — no unit, integration, or e2e tests.
2. No `.env.example` — `NEXT_PUBLIC_API_URL` is undocumented.
3. No error boundaries — unhandled errors crash the full page.
4. No loading skeletons — layout shifts on data fetch.
5. No CI pipeline — no automated lint/build/test on push.
6. No `AGENTS.md` existed before this session.
7. `src/modules/` has no `index.ts` barrel exports — agents must guess import paths.
8. `BookingFormData` is not persisted in the booking store — the wizard loses state on refresh.

### What's Wrong

1. **Unused dependencies** — `axios`, `pigeon-maps`, and `@react-google-maps/api` are in `package.json` but not used. They add ~500 KB to the bundle and mislead agents about which libraries to use.
2. **`cn()` reimplements `clsx`** — `clsx` is already a dependency; `cn()` in `src/lib/cn.ts` duplicates it without the full feature set (no object/array support). Agents may use either inconsistently.
3. **`useEffect` auth guard has a race condition** — `useRequireAuth` redirects inside `useEffect`, which runs after the first render. Protected content flashes briefly before redirect.
4. **`bookingData.serviceType` sync `useEffect` has a stale-closure bug** — the dependency array omits `bookingData.serviceType` indirectly via the condition `bookingData.serviceType !== typeFromUrl`, which will cause the linter to warn and may cause missed updates.
5. **`icon: any` in `LoginView.tsx`** — `ROLE_DATA` uses `icon: any` for Lucide icon components. Should be typed as `React.ComponentType<{ size?: number; className?: string }>` or `LucideIcon`.
6. **`getPriceEstimate` is not async-ready** — it returns a hardcoded `number` synchronously. When a real pricing API is added, all call sites will need to change. It should return `Promise<number>` now.
7. **`tsconfig.json` has inconsistent formatting** — `baseUrl` and `paths` are not indented consistently with the rest of the file.
8. **`next.config.ts` is empty** — no `images.remotePatterns`, no `env` validation, no `headers`. Agents have no guidance on what belongs here.

---

## Improvement Specs

---

### SPEC-01 — Remove unused dependencies

**Problem:** `axios`, `pigeon-maps`, and `@react-google-maps/api` are in `dependencies` but have zero imports in the codebase. They inflate bundle size and mislead agents into thinking they are the preferred HTTP/map libraries.

**Fix:**
```bash
pnpm remove axios pigeon-maps @react-google-maps/api
```

**Acceptance:** `package.json` no longer lists these three packages. `pnpm build` passes. No import errors.

---

### SPEC-02 — Replace `cn()` with `clsx` + `tailwind-merge`

**Problem:** `src/lib/cn.ts` reimplements a subset of `clsx` (string-only, no object/array support). `clsx` and `tailwind-merge` are already installed. Agents may use either `cn()` or `clsx` directly, producing inconsistent class merging.

**Fix:**

Replace `src/lib/cn.ts`:
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

Update `src/lib/index.ts` to re-export `cn`. No call-site changes needed.

**Acceptance:** `cn({ "bg-red-500": true }, "bg-blue-500")` returns `"bg-blue-500"` (tailwind-merge deduplication works). All existing `cn()` call sites continue to compile.

---

### SPEC-03 — Fix `useRequireAuth` flash-of-protected-content

**Problem:** `useRequireAuth` redirects inside `useEffect`, which fires after the first render. Protected route content renders for one frame before the redirect, causing a visible flash and potential data fetches on unauthenticated state.

**Fix:**

Replace the `useEffect`-based redirect with a synchronous check using `useRouter` and render `null` until auth is confirmed:

```typescript
// src/application/hooks/useAuth.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/application/store/authStore";
import type { UserRole } from "@/src/domain/auth/types";

export function useRequireAuth(requiredRole: UserRole) {
  const router = useRouter();
  const { isAuthenticated, role } = useAuthStore();
  const authorized = isAuthenticated && role === requiredRole;

  useEffect(() => {
    if (!authorized) {
      router.replace("/auth/login");
    }
  }, [authorized, router]);

  return { authorized };
}
```

Update layout components to render `null` when not authorized:

```typescript
// app/customer/layout.tsx
"use client";
import { useRequireAuth } from "@/src/application/hooks/useAuth";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { authorized } = useRequireAuth("customer");
  if (!authorized) return null;
  return <>{children}</>;
}
```

Apply the same pattern to `app/mover/layout.tsx`, `app/company/layout.tsx`, `app/admin/layout.tsx`.

**Acceptance:** Navigating directly to `/customer` while unauthenticated shows a blank screen (not a flash of content) before redirecting to `/auth/login`.

---

### SPEC-04 — Fix `BookView` `useEffect` dependency array

**Problem:** The `useEffect` in `BookView.tsx` that syncs `typeFromUrl` into `bookingData` has `bookingData.serviceType` used inside the effect body but not listed in the dependency array. ESLint's `exhaustive-deps` rule will warn; the effect may also miss updates.

**Fix:**

Restructure to derive initial state from the URL param without a sync effect:

```typescript
// Remove the useEffect that syncs typeFromUrl.
// Instead, initialise bookingData once using a lazy useState initialiser:

const [bookingData, setBookingData] = useState<BookingFormData>(() => ({
  serviceType: typeFromUrl,
  pickup: "",
  pickupCoords: null,
  dropoff: "",
  dropoffCoords: null,
  items: (typeFromUrl === "haulage" || typeFromUrl === "dispatch")
    ? [{ name: "", qty: 1, weight: "" }]
    : [],
  vehicleDescription: "",
  passengers: "1",
  vehicleType: "",
  scheduleDate: "",
  scheduleTime: "",
}));
```

If the URL param can change while the component is mounted (e.g. user navigates between service types), handle it with a `key` prop on the parent instead of a sync effect.

**Acceptance:** `pnpm lint` reports no `react-hooks/exhaustive-deps` warnings in `BookView.tsx`.

---

### SPEC-05 — Type Lucide icons properly in `LoginView.tsx`

**Problem:** `ROLE_DATA` uses `icon: any` for Lucide icon components. This defeats TypeScript's strict mode for that property and misleads agents into thinking `any` is acceptable for component props.

**Fix:**

```typescript
import type { LucideIcon } from "lucide-react";

const ROLE_DATA: Record<Role, {
  label: string;
  icon: LucideIcon;
  description: string;
  tagline: string;
}> = { ... };
```

**Acceptance:** `pnpm build` passes with no type errors. No `any` in `LoginView.tsx`.

---

### SPEC-06 — Add `.env.example`

**Problem:** `NEXT_PUBLIC_API_URL` is the only environment variable but is undocumented. Agents and new developers have no reference for what to set.

**Fix:**

Create `.env.example` at the repo root:
```
# Base URL for the MoversPadi backend API.
# Leave empty to use relative paths (e.g. when API is co-hosted).
NEXT_PUBLIC_API_URL=https://api.moverspadi.com
```

Reference it in AGENTS.md under "Environment variables".

**Acceptance:** `.env.example` exists. `.gitignore` already excludes `.env*` (confirmed).

---

### SPEC-07 — Add a test suite

**Problem:** There are zero tests. Agents cannot verify correctness of changes, and regressions go undetected.

**Fix — Phase 1 (unit tests):**

Install Vitest with jsdom and React Testing Library:
```bash
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event
```

Add `vitest.config.ts`:
```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

Add `"test": "vitest"` to `package.json` scripts.

**Minimum test targets (in priority order):**
1. `src/lib/format.ts` — `formatNaira`, `formatDate`, `truncate`
2. `src/lib/cn.ts` — after SPEC-02 is applied
3. `src/infrastructure/api/client.ts` — mock `fetch`, assert headers and error throwing
4. `src/infrastructure/geocoding/nominatim.ts` — mock `fetch`, assert URL construction
5. `src/application/store/authStore.ts` — login/logout state transitions
6. `src/application/store/bookingStore.ts` — confirmBooking, resetBooking

**Acceptance:** `pnpm test` runs and all unit tests pass. Coverage for `src/lib/` is 100%.

---

### SPEC-08 — Add CI pipeline

**Problem:** No automated checks run on push or pull request. Lint and build failures are only caught locally.

**Fix:**

Create `.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm build
      - run: pnpm test        # once SPEC-07 is done
```

**Acceptance:** The workflow runs on every PR. A lint or build failure blocks merge.

---

### SPEC-09 — Make `getPriceEstimate` async

**Problem:** `bookingApi.getPriceEstimate()` returns a synchronous `number`. When a real pricing endpoint is added, every call site must change signature. Making it `Promise<number>` now costs nothing and prevents a breaking refactor later.

**Fix:**

```typescript
// src/infrastructure/api/booking.ts
getPriceEstimate: async (serviceType: string): Promise<number> => {
  const priceMap: Record<string, number> = {
    ride: 3500,
    dispatch: 5000,
    haulage: 45000,
    tow: 15000,
  };
  return priceMap[serviceType] ?? 5000;
},
```

Update all call sites to `await bookingApi.getPriceEstimate(...)`.

**Acceptance:** `pnpm build` passes. No synchronous call sites remain.

---

### SPEC-10 — Fix `tsconfig.json` formatting

**Problem:** `baseUrl` and `paths` are not indented consistently with the rest of `compilerOptions`. This is cosmetic but causes noisy diffs and confuses agents that read the file.

**Fix:** Re-indent `baseUrl` and `paths` to match the 4-space indent of the surrounding `compilerOptions` block.

**Acceptance:** `tsconfig.json` has consistent indentation throughout.

---

## Priority Order

| Priority | Spec | Effort | Impact |
|----------|------|--------|--------|
| 1 | SPEC-01 Remove unused deps | Low | High — bundle size + agent clarity |
| 2 | SPEC-06 Add `.env.example` | Low | High — onboarding |
| 3 | SPEC-02 Fix `cn()` | Low | Medium — correctness |
| 4 | SPEC-05 Type Lucide icons | Low | Medium — type safety |
| 5 | SPEC-10 Fix tsconfig formatting | Low | Low — cosmetic |
| 6 | SPEC-04 Fix BookView useEffect | Medium | Medium — correctness |
| 7 | SPEC-03 Fix auth flash | Medium | Medium — UX + security |
| 8 | SPEC-09 Make getPriceEstimate async | Low | Medium — future-proofing |
| 9 | SPEC-07 Add test suite | High | High — long-term quality |
| 10 | SPEC-08 Add CI pipeline | Medium | High — long-term quality |
