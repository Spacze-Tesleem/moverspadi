# MOVERS-IMPROVEMENT-SPEC.md

Concrete improvements to MOVERS.md and the codebase.
Each item states the problem, the fix, and the acceptance criterion.

---

## Audit Summary

### What's Good

- **Layered architecture is real and enforced.** `domain/` → `application/` → `infrastructure/` → `modules/` → `app/` is consistently applied. `src/domain/` has zero framework imports.
- **Thin routing shells.** Every `app/*/page.tsx` is a one-liner that renders a `*View`. The pattern is uniform across all four roles.
- **Auth guard is correct.** `useRequireAuth` waits for Zustand rehydration (`_hydrated`) before redirecting, preventing false redirects on first load. Layouts return `null` until authorized — no flash of protected content.
- **`BookView` lazy initialiser is correct.** `bookingData` is initialised from `typeFromUrl` via a `useState` lazy initialiser, not a sync `useEffect`. No stale-closure bug exists here.
- **`LoginView` icon typing is correct.** `ROLE_DATA` uses `React.ComponentType<{ className?: string; strokeWidth?: number }>`, not `any`.
- **Shared API client.** `apiClient` in `src/infrastructure/api/client.ts` centralises fetch, auth headers, and error handling. No direct `fetch` calls in components.
- **Geocoding is isolated.** Nominatim calls are in `src/infrastructure/geocoding/nominatim.ts`.
- **Utility functions are named and typed.** `cn()`, `formatNaira()`, `formatDate()`, `truncate()` are all in `src/lib/` and re-exported from `src/lib/index.ts`.
- **Zustand stores are typed.** Both stores have explicit state interfaces and use `persist` consistently.
- **Map SSR guard is in place.** `MapPreview` is loaded with `dynamic(..., { ssr: false })`.
- **Dev fallback in `LoginView`.** The dev credential bypass is clearly commented and scoped to when `NEXT_PUBLIC_API_URL` is unset.

---

### What's Missing

1. No test suite — no unit, integration, or e2e tests configured.
2. No `.env.example` — `NEXT_PUBLIC_API_URL` is undocumented for new developers.
3. No error boundaries — unhandled render errors crash the full page.
4. No loading skeleton components — layout shifts on data fetch.
5. No CI pipeline — no automated lint/build/test on push or PR.
6. `src/modules/` has no barrel `index.ts` exports — import paths must be guessed.
7. `BookingFormData` wizard state is not persisted — the booking wizard loses all data on page refresh.
8. `ThemeContext` is only mounted inside `CustomerDashboardView`, not at the root layout — other roles cannot use it, and the theme resets on navigation away from the dashboard.

---

### What's Wrong

1. **`cn()` does not use `tailwind-merge`.** `src/lib/cn.ts` is a plain string join (`filter(Boolean).join(" ")`). Both `clsx` and `tailwind-merge` are installed as dependencies but unused. Conflicting Tailwind classes (e.g. `bg-red-500 bg-blue-500`) are not deduplicated, causing silent styling bugs.

2. **`icon: any` in four files.** `DetailsStep.tsx` (`VehicleCard`), `ConfirmStep.tsx` (`SERVICE_ICONS`), `SearchingView.tsx`, `AdminDashboardView.tsx`, and `CompanyDashboardView.tsx` all use `icon: any` for Lucide icon components. This defeats strict mode for those props.

3. **`getPriceEstimate` is synchronous.** `bookingApi.getPriceEstimate()` returns a plain `number`. When a real pricing endpoint is added, every call site must change signature. It should return `Promise<number>` now.

4. **Unused dependencies inflate the bundle.** `axios`, `pigeon-maps`, and `@react-google-maps/api` are in `package.json` with zero imports anywhere in the codebase. They add dead weight and mislead agents about which libraries to use.

5. **`tsconfig.json` has broken indentation.** `baseUrl` and `paths` are at column 0 inside `compilerOptions`. This causes noisy diffs and confuses JSON-aware tools.

6. **`next.config.ts` is empty.** No `images.remotePatterns`, no `env` validation, no `headers`. Agents have no guidance on what belongs here, and avatar/image URLs will fail if a backend is connected.

7. **`MOVERS.md` claims "Next.js 16" but `package.json` says `16.1.6`.** The version string should match `package.json` exactly.

8. **`MOVERS.md` does not document `src/context/`.** `ThemeContext.tsx` exists and is used by three files, but the architecture section omits it entirely.

9. **`MOVERS.md` does not document `types/`.** The `types/` directory at the repo root contains `cache-life.d.ts` and `routes.d.ts` but is not mentioned anywhere.

10. **`README.md` is the default `create-next-app` template.** It contains no project-specific information and references `npm`/`yarn`/`bun` despite the project using `pnpm` exclusively.

---

## Improvement Specs

---

### SPEC-01 — Fix `cn()` to use `clsx` + `tailwind-merge`

**Problem:** `src/lib/cn.ts` joins class strings with a space. Conflicting Tailwind utilities (e.g. passing both `bg-red-500` and `bg-blue-500`) are not resolved — both end up in the output and the last one wins by CSS specificity, not by call order. `clsx` and `tailwind-merge` are already installed.

**Fix:**

Replace `src/lib/cn.ts`:
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

No call-site changes needed — the function signature is identical.

**Acceptance:** `cn("bg-red-500", "bg-blue-500")` returns `"bg-blue-500"`. `pnpm build` passes. All existing `cn()` call sites compile without changes.

---

### SPEC-02 — Type Lucide icons with `LucideIcon` instead of `any`

**Problem:** Five files use `icon: any` for Lucide icon components:
- `src/modules/customer/booking/components/DetailsStep.tsx` — `VehicleCard` prop
- `src/modules/customer/booking/components/ConfirmStep.tsx` — `SERVICE_ICONS` record
- `src/modules/customer/tracking/views/SearchingView.tsx` — `serviceIcons` record
- `src/modules/admin/views/AdminDashboardView.tsx` — `navItems` and `ALERT_STYLES`
- `src/modules/company/views/CompanyDashboardView.tsx` — `navItems`

**Fix:**

Import `LucideIcon` from `lucide-react` and replace `any`:

```typescript
import type { LucideIcon } from "lucide-react";

// VehicleCard prop
{ label: string; icon: LucideIcon; active: boolean; onClick: () => void }

// Icon record
const SERVICE_ICONS: Record<string, LucideIcon> = { ... };

// Nav items
{ id: ActiveView; label: string; icon: LucideIcon; badge?: number }
```

**Acceptance:** `pnpm build` passes with no type errors. `grep -r "icon: any"` returns no results in `src/`.

---

### SPEC-03 — Remove unused dependencies

**Problem:** `axios`, `pigeon-maps`, and `@react-google-maps/api` are in `dependencies` with zero imports in the codebase. They inflate the production bundle and mislead agents into thinking they are the preferred HTTP/map libraries.

**Fix:**
```bash
pnpm remove axios pigeon-maps @react-google-maps/api
```

**Acceptance:** `package.json` no longer lists these three packages. `pnpm build` passes. No import errors.

---

### SPEC-04 — Make `getPriceEstimate` return `Promise<number>`

**Problem:** `bookingApi.getPriceEstimate()` returns a synchronous `number`. When a real pricing endpoint is added, every call site must change. Making it async now costs nothing and prevents a breaking refactor later.

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

**Acceptance:** `pnpm build` passes. No synchronous call sites remain. The function signature is `Promise<number>`.

---

### SPEC-05 — Add `.env.example`

**Problem:** `NEXT_PUBLIC_API_URL` is the only environment variable but is undocumented. New developers and agents have no reference for what to set, and the dev fallback in `LoginView` is only discovered by reading the source.

**Fix:**

Create `.env.example` at the repo root:
```
# Base URL for the MoversPadi backend API.
# Leave empty to use relative paths (e.g. when API is co-hosted).
# When unset, LoginView falls back to DEV_CREDENTIALS for local development.
NEXT_PUBLIC_API_URL=https://api.moverspadi.com
```

Update `MOVERS.md` under "Environment variables" to reference `.env.example`.

**Acceptance:** `.env.example` exists at the repo root. `.gitignore` already excludes `.env*` (confirmed).

---

### SPEC-06 — Fix `tsconfig.json` indentation

**Problem:** `baseUrl` and `paths` are at column 0 inside `compilerOptions`, breaking the surrounding indent. This causes noisy diffs and confuses JSON-aware tools.

**Fix:**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    ...
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Acceptance:** `tsconfig.json` has consistent indentation throughout. `pnpm build` passes.

---

### SPEC-07 — Update `MOVERS.md` to reflect actual codebase

**Problem:** Several inaccuracies and omissions in `MOVERS.md` will cause agents to make wrong assumptions:

1. Version says "Next.js 16" — should be "Next.js 16.1.6" (match `package.json`).
2. Architecture section omits `src/context/` — `ThemeContext.tsx` is used by three files.
3. Architecture section omits `types/` at the repo root — contains `cache-life.d.ts` and `routes.d.ts`.
4. "What Does Not Exist Yet" lists the `useRequireAuth` flash issue as unfixed — it was already fixed with the `_hydrated` guard.
5. "What Does Not Exist Yet" should note that `axios`, `pigeon-maps`, and `@react-google-maps/api` are being removed (SPEC-03).

**Fix:**

Update `MOVERS.md`:
- Change "Next.js 16" to "Next.js 16.1.6" in the stack line.
- Add `src/context/` to the architecture tree: `ThemeContext.tsx — light/dark theme state (customer dashboard only; see SPEC-09 to promote to root)`.
- Add `types/` to the architecture tree: `cache-life.d.ts, routes.d.ts — Next.js generated type declarations`.
- Remove the stale `useRequireAuth` flash note from "What Does Not Exist Yet".
- Update the unused dependencies note to reflect SPEC-03.

**Acceptance:** `MOVERS.md` architecture tree matches the actual directory structure. No stale items in "What Does Not Exist Yet".

---

### SPEC-08 — Persist booking wizard state across refreshes

**Problem:** `BookingFormData` (the 4-step wizard state) lives in local `useState` inside `BookView`. A page refresh loses all entered data. The `bookingStore` persists `ActiveBooking` (post-confirmation state) but not the in-progress wizard data.

**Fix:**

Add `wizardData` to `bookingStore`:

```typescript
// src/application/store/bookingStore.ts
interface BookingState extends ActiveBooking {
  wizardData: BookingFormData | null;
  setWizardData: (data: BookingFormData) => void;
  // ... existing actions
}

// In initialState:
wizardData: null,

// In resetBooking:
resetBooking: () => set({ ...initialState, wizardData: null }),
```

Update `BookView` to initialise `bookingData` from `useBookingStore().wizardData` if present, and call `setWizardData` on every `setBookingData` call.

**Acceptance:** Entering data in step 1 of the booking wizard, refreshing the page, and returning to `/customer/book?type=dispatch` restores the entered data.

---

### SPEC-09 — Move `ThemeProvider` to root layout

**Problem:** `ThemeProvider` is mounted inside `CustomerDashboardView`. This means:
- The theme resets to `"light"` on every navigation away from the dashboard.
- Other roles (mover, company, admin) cannot use `useTheme()` without mounting their own provider.

**Fix:**

Move `<ThemeProvider>` to `app/layout.tsx`:

```typescript
// app/layout.tsx
import { ThemeProvider } from "@/src/context/ThemeContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

Remove the `ThemeProvider` wrapper from `CustomerDashboardView`.

**Acceptance:** Theme persists across navigation. `useTheme()` works in any component without a local provider. `pnpm build` passes.

---

### SPEC-10 — Add a test suite

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

**Minimum test targets (priority order):**
1. `src/lib/format.ts` — `formatNaira`, `formatDate`, `truncate`
2. `src/lib/cn.ts` — after SPEC-01; verify `twMerge` deduplication
3. `src/infrastructure/api/client.ts` — mock `fetch`, assert headers and error throwing
4. `src/infrastructure/geocoding/nominatim.ts` — mock `fetch`, assert URL construction and Nigeria country code
5. `src/application/store/authStore.ts` — login/logout state transitions, `_hydrated` flag
6. `src/application/store/bookingStore.ts` — `confirmBooking`, `resetBooking`, wizard data persistence (after SPEC-08)

**Acceptance:** `pnpm test` runs and all unit tests pass. Coverage for `src/lib/` is 100%.

---

### SPEC-11 — Add CI pipeline

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
      - run: pnpm test   # add after SPEC-10 is done
```

**Acceptance:** The workflow runs on every PR. A lint or build failure blocks merge.

---

### SPEC-12 — Replace `README.md` with project-specific content

**Problem:** `README.md` is the unmodified `create-next-app` template. It references `npm`, `yarn`, and `bun` despite the project using `pnpm` exclusively, and contains no project-specific information.

**Fix:**

Replace `README.md` with a minimal project README:
- Project name and one-line description
- Prerequisites (Node 20+, pnpm 9+)
- Setup: `pnpm install`, copy `.env.example` to `.env.local`
- Dev: `pnpm dev`
- Lint/build: `pnpm lint`, `pnpm build`
- Link to `MOVERS.md` for architecture and agent guidance

**Acceptance:** `README.md` contains no references to `npm`, `yarn`, or `bun`. A new developer can set up the project by following it.

---

## Priority Order

| Priority | Spec | Effort | Impact |
|----------|------|--------|--------|
| 1 | SPEC-01 Fix `cn()` | Low | High — silent styling bugs |
| 2 | SPEC-03 Remove unused deps | Low | High — bundle size + agent clarity |
| 3 | SPEC-05 Add `.env.example` | Low | High — onboarding |
| 4 | SPEC-06 Fix `tsconfig.json` indentation | Low | Low — cosmetic |
| 5 | SPEC-02 Type Lucide icons | Low | Medium — type safety |
| 6 | SPEC-07 Update `MOVERS.md` | Low | Medium — agent accuracy |
| 7 | SPEC-04 Make `getPriceEstimate` async | Low | Medium — future-proofing |
| 8 | SPEC-09 Move `ThemeProvider` to root | Low | Medium — correctness |
| 9 | SPEC-12 Replace `README.md` | Low | Medium — onboarding |
| 10 | SPEC-08 Persist wizard state | Medium | Medium — UX |
| 11 | SPEC-10 Add test suite | High | High — long-term quality |
| 12 | SPEC-11 Add CI pipeline | Medium | High — long-term quality |
