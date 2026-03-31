# AGENTS.md — MoversPadi

Agent guidance for working in this repository.

---

## Project Overview

**MoversPadi** is a Next.js 16 logistics platform for Nigeria. It supports four user roles — customer, mover, company, and admin — and four service types: ride, dispatch, haulage, and tow.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4 · Zustand 5 · Framer Motion · Leaflet / React-Leaflet · pnpm

---

## Architecture

The project follows a domain-driven, feature-module structure. Understand this before making changes.

```
app/                        # Next.js App Router — thin routing shells only
  auth/                     # /auth/* routes
  customer/                 # /customer/* routes
  mover/, company/, admin/  # role-specific routes

src/
  domain/                   # Pure TypeScript types — no framework imports
    auth/types.ts
    booking/types.ts
    user/types.ts

  application/              # Business logic
    hooks/                  # React hooks (e.g. useRequireAuth)
    store/                  # Zustand stores (authStore, bookingStore)

  infrastructure/           # External integrations
    api/                    # HTTP client + per-domain API modules
    geocoding/              # Nominatim (OpenStreetMap) geocoding

  components/               # Shared UI components (e.g. MapPreview)
  modules/                  # Feature modules, organized by role/journey
    marketing/              # Landing page components + LandingView
    auth/                   # Login, Signup, OTP, Role views
    customer/
      booking/              # 4-step booking wizard (Location→Details→Schedule→Confirm)
      dashboard/
      history/
      profile/
      tracking/
      shared/               # Shared customer UI (Sidebar, GeoLocationButton)
    mover/, company/, admin/
  config/                   # fonts.ts, metadata.ts
  lib/                      # Utilities: cn(), formatNaira(), formatDate(), truncate()
```

### Key Rules

- `app/` pages must stay thin — import a `*View` component from `src/modules/` and render it. No logic in `app/`.
- `src/domain/` must stay framework-free. No React, no Zustand, no Next.js imports.
- `src/infrastructure/api/` uses the shared `apiClient` from `client.ts`. Do not use `axios` directly in new code — `axios` is a dependency but the project uses `fetch`-based `apiClient`.
- Map components must be loaded with `dynamic(..., { ssr: false })` to avoid SSR errors.
- Auth guard is applied at the layout level via `useRequireAuth(role)` in `app/<role>/layout.tsx`.

---

## Development

```bash
pnpm install          # install dependencies
pnpm dev              # start dev server on :3000
pnpm build            # production build
pnpm lint             # ESLint (Next.js core-web-vitals + TypeScript rules)
```

**Package manager:** pnpm. Do not use npm or yarn to install packages.

**Environment variables:**
- `NEXT_PUBLIC_API_URL` — base URL for the backend API (defaults to `""` if unset, meaning relative paths)

---

## Coding Conventions

### TypeScript
- `strict: true` is enforced. No `any` unless unavoidable and commented.
- Path alias `@/*` maps to the repo root. Use `@/src/...` for source imports.
- Domain types live in `src/domain/`. Extend them there, not inline in components.

### Components
- All interactive components that use hooks or browser APIs must have `"use client"` at the top.
- Use `cn()` from `@/src/lib/cn` for conditional class merging (not `clsx` directly, though it is available).
- Currency formatting: always use `formatNaira()` from `@/src/lib/format`.
- Date formatting: always use `formatDate()` from `@/src/lib/format`.

### Styling
- Tailwind CSS 4. No inline `style` props unless dynamic values cannot be expressed as classes.
- Dark theme: background `#080808` / `#0a0a0a`, text `zinc-*`, accent `violet-500`.
- Do not introduce new color tokens without updating this file.

### State Management
- Global state: Zustand stores in `src/application/store/`.
- Both stores use `persist` with `localStorage`. Keys: `moverspadi-auth`, `moverspadi-booking`.
- Local UI state: `useState` inside the component.

### API Calls
- Use `src/infrastructure/api/` modules. Do not call `fetch` or `apiClient` directly from components.
- Pass the auth token from `useAuthStore().token` when calling authenticated endpoints.

---

## Adding New Features

### New page/route
1. Create `app/<path>/page.tsx` — import and render a `*View` from `src/modules/`.
2. Create the view in `src/modules/<module>/views/<Name>View.tsx`.
3. If the route requires auth, add a `layout.tsx` that calls `useRequireAuth(role)`.

### New service type
1. Add the type to `ServiceType` in `src/domain/booking/types.ts`.
2. Add a `ServiceDefinition` entry to `SERVICE_TYPES` in the same file.
3. Update `bookingApi.getPriceEstimate()` in `src/infrastructure/api/booking.ts`.

### New domain entity
1. Create `src/domain/<entity>/types.ts` — pure TypeScript only.
2. Create `src/infrastructure/api/<entity>.ts` using `apiClient`.
3. Create `src/application/store/<entity>Store.ts` if global state is needed.

---

## What Does Not Exist Yet

- No test suite (no Jest, Vitest, Playwright, or Cypress configured).
- No error boundary components.
- No loading skeleton components.
- No API mock / MSW setup.
- No CI/CD pipeline (no `.github/workflows/`).
- `NEXT_PUBLIC_API_URL` is not documented in a `.env.example`.
- `axios` is listed as a dependency but unused — the project uses `fetch`-based `apiClient`.
- `pigeon-maps` is listed as a dependency but appears unused (project uses Leaflet).
- `@react-google-maps/api` is listed as a dependency but appears unused (project uses Nominatim/Leaflet).
