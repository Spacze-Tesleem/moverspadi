
# MoversPadi

MoversPadi is a Next.js 16 logistics platform for Nigeria with support for four user roles — customer, mover, company, and admin — and multiple service types such as ride, dispatch, haulage, and tow.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Zustand 5
- Framer Motion
- Leaflet / React-Leaflet
- pnpm

## Project Structure

The repository is organized to keep framework-specific concerns separated from domain logic.

```
app/                        # Next.js App Router routes and layouts
  (public)/                 # public landing and marketing page
    page.tsx
  (auth)/                   # auth flow group
    auth/
      layout.tsx
      login/page.tsx
      otp/page.tsx
      role/page.tsx
      signup/page.tsx
  (portals)/                # authenticated portal shells
    admin/
      layout.tsx
      page.tsx
    company/
      layout.tsx
      onboarding/page.tsx
      page.tsx
    customer/
      layout.tsx
      book/page.tsx
      history/page.tsx
      price/page.tsx
      profile/page.tsx
      searching/page.tsx
      track/page.tsx
      page.tsx
    mover/
      layout.tsx
      onboarding/page.tsx
      page.tsx
    provider/
      layout.tsx
      onboarding/page.tsx
      page.tsx
  api/                      # serverless API routes
    auth/session/route.ts
  become-a-mover/page.tsx
  services/page.tsx

src/
  application/              # business logic and client-side state
    hooks/
      useAuth.ts
    store/
      authStore.ts
      bookingStore.ts
      notificationsStore.ts
  components/               # shared UI components
    map/                   # map previews and related UI
      MapPreview.tsx
  config/                   # runtime metadata and fonts
    fonts.ts
    metadata.ts
  context/                  # app context providers
    ThemeContext.tsx
  domain/                   # pure TypeScript types, no framework imports
    auth/types.ts
    booking/types.ts
    user/types.ts
  infrastructure/           # external integrations and API clients
    api/
      admin.ts
      auth.ts
      booking.ts
      client.ts
      company.ts
      mover.ts
      profile.ts
    geocoding/
      nominatim.ts
  lib/                      # shared utilities
    cn.ts
    format.ts
    index.ts
    session.ts
    sessionClient.ts
  modules/                  # feature modules and views by domain
    admin/
      views/
        AdminDashboardView.tsx
    auth/
      views/
        LoginView.tsx
        OtpView.tsx
        PendingApprovalView.tsx
        RoleView.tsx
        SignupView.tsx
    company/
      views/
        CompanyDashboardView.tsx
        CompanyOnboardingView.tsx
    customer/
      booking/
      dashboard/
      history/
      profile/
      shared/
      tracking/
    marketing/
      components/
      views/
    mover/
      views/
  globals.css               # global Tailwind styles

public/                      # static assets

middleware.ts                # global middleware
next.config.ts               # Next.js configuration
vercel.json                  # deployment config
package.json                 # dependencies and scripts
tsconfig.json                # TypeScript config

```

## Routing and Layouts

- `app/(public)/page.tsx` is the public landing experience.
- `app/(auth)/auth/*` contains login, signup, OTP, and role selection.
- `app/(portals)/*` contains authenticated portal shells for admin, company, customer, mover, and provider.
- Portal layouts apply auth guards and render portal-specific views.
- `app/api/auth/session/route.ts` exposes the auth session API route.

## Key Conventions

- Keep `app/` route files thin. Render `*View` components from `src/modules/` rather than embedding business logic in pages.
- Keep `src/domain/` framework-free. Do not import React, Zustand, or Next.js from domain type files.
- Use `src/infrastructure/api/client.ts` for shared API call logic.
- Prefer application-specific API wrappers from `src/infrastructure/api/` instead of calling `fetch` directly from components.
- Dynamic map components must be imported with `dynamic(..., { ssr: false })` to avoid SSR issues.
- Authentication guards belong at the layout level, typically via `useRequireAuth(role)`.

## Development

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm test:watch
```

The dev server runs on port `5000` by default.

## Environment

- `NEXT_PUBLIC_API_URL` — base URL for the backend API.

## Dependencies

### Core

- `next` ^16.2.4
- `react` ^19.2.5
- `react-dom` ^19.2.5
- `tailwindcss` ^4.2.4
- `framer-motion` ^12.38.0
- `zustand` ^5.0.12
- `leaflet` ^1.9.4
- `react-leaflet` ^5.0.0
- `leaflet-routing-machine` ^3.2.12
- `lucide-react` ^0.575.0
- `clsx` ^2.1.1
- `axios` ^1.15.2
- `@react-google-maps/api` ^2.20.8
- `pigeon-maps` ^0.22.1
- `tailwind-merge` ^3.5.0

### Dev

- `typescript` ^5.9.3
- `eslint` ^9.39.4
- `eslint-config-next` ^16.2.4
- `vitest` ^4.1.5
- `@vitest/coverage-v8` ^4.1.5
- `@types/node` ^20.19.39
- `@types/react` ^19.2.14
- `@types/react-dom` ^19.2.3
- `@types/leaflet` ^1.9.21
- `@tailwindcss/postcss` ^4.2.4

## Notes

- This repo uses `pnpm`; avoid `npm` or `yarn` for dependency management.
- The project currently has an app router structure with top-level route groups and feature modules.
- The `src/application` layer contains Zustand stores and reusable hooks.
- The `src/infrastructure/api` layer contains HTTP wrappers and the shared `apiClient`.
- `src/domain` houses type definitions and domain models only.

## Missing / Observed Gaps

- No dedicated test setup beyond `vitest` scripts.
- No error boundary components.
- No loading skeletons or global loading components.
- No CI/CD workflow definitions in `.github/workflows/`.
- `NEXT_PUBLIC_API_URL` is not currently documented in a `.env.example` file.
- Some installed dependencies such as `axios`, `@react-google-maps/api`, and `pigeon-maps` are present in `package.json` but may not be actively used by the current app code.
