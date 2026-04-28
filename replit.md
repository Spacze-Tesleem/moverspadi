# MoversPadi

A Next.js 16 web application for the MoversPadi platform — a fleetless logistics marketplace connecting customers to dispatch, haulage, tow, and transport providers.

## Architecture

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **State**: Zustand (persisted to localStorage)
- **Maps**: Leaflet / React-Leaflet, Pigeon Maps, Google Maps API
- **Animations**: Framer Motion
- **HTTP**: Custom fetch-based API client with Bearer token auth
- **Dashboard styling**: Customer uses a smoke-white dashboard background; admin, mover, and company dashboards share a cleaner SaaS-style smoke-white skin via `customer-dashboard-skin` with crisp white cards, stronger slate text, and controlled blue/green status accents

## Project Structure

```
app/                          # Next.js App Router — thin route shells only
  (public)/                   # Public pages (no auth required)
    page.tsx                  # Landing page → /
  (auth)/                     # Authentication flows
    auth/
      login/                  # → /auth/login
      signup/                 # → /auth/signup
      otp/                    # → /auth/otp
      role/                   # → /auth/role
  (portals)/                  # Protected role-based dashboards
    customer/                 # → /customer (and sub-routes)
    mover/                    # → /mover
    company/                  # → /company
    admin/                    # → /admin

src/
  features/                   # Business domain modules (one folder per portal)
    auth/                     # Login, signup, OTP, role selection views
    customer/                 # Booking, dashboard, history, profile, tracking
    mover/                    # Mover dashboard and onboarding wizard
    company/                  # Company dashboard
    admin/                    # Admin dashboard
    marketing/                # Public landing page components

  services/                   # External integrations
    api/                      # Backend REST API clients (auth, booking, mover, profile)
    geocoding/                # OpenStreetMap Nominatim address search

  store/                      # Global Zustand state
    authStore.ts              # User session, role, token
    bookingStore.ts           # Active booking data

  hooks/                      # Shared React hooks
    useAuth.ts                # Auth guard / redirect logic

  types/                      # Domain data contracts (TypeScript interfaces)
    auth/
    user/
    booking/

  ui/                         # Shared UI components
    map/                      # Leaflet map preview component

  lib/                        # Utilities (cn, format)
  config/                     # Fonts, metadata
  context/                    # React context providers (ThemeContext)
  globals.css                 # Global styles
```

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend origin — e.g. `https://moverspadi.onrender.com` |

## Running Locally

```bash
npm run dev    # → http://localhost:5000
npm run build  # production build
npm run start  # → http://localhost:5000 (production)
```

## Replit Configuration

- Dev server binds to `0.0.0.0:5000` for Replit preview iframe
- `next.config.ts` allows Replit preview development origins, including `*.replit.dev`, `*.riker.replit.dev`, and `*.picard.replit.dev`
- Workflow: **Start application** → `npm run dev`

## Audit Fixes Applied (vs. Build Pack)

1. **Customer dashboard service list**: Changed `id: "ride"` → `id: "transport"`, label "Ride" → "Transport", route `?type=ride` → `?type=transport` — now matches the four canonical services: Dispatch, Transport, Haulage, Tow.
2. **Vehicle type options** (MoverOnboarding, ProviderOnboarding, CompanyOnboarding): Replaced non-spec types (`tricycle`, `car`, `van/bus`, `pickup`) with the spec-defined set: `motorcycle`, `van`, `truck`, `tow_truck`, `private_car`, `bus`.
3. **Guarantor fields** (MoverOnboarding & ProviderOnboarding): Added `guarantorAddress` and `guarantorOccupation` to the FormData type and Step 3 Address form as required by the DB schema.
4. **Role selection flow** (`RoleView`): Added `provider` (Transport Provider) as a third mover sub-type alongside Independent Mover and Logistics Company. `MoverSubType` is now `"mover" | "provider" | "company"`.
5. **PendingApprovalView**: Added `provider: "Transport Provider"` to `ROLE_LABELS` so pending-approval messaging is correct for transport provider accounts.
6. **Admin verification badge**: Changed from hardcoded `INITIAL_QUEUE.filter(...)` to live `queue.filter(...)` so the badge reflects real-time state changes.
7. **Admin logout redirect**: `logout()` now also calls `router.push("/auth/login")` so the admin is properly redirected after ending a session.
8. **Company dashboard branding**: Corrected "LogisPadi" → "MoversPadi" in the sidebar header.
9. **`UserProfile` domain type**: Added missing DB schema fields — `city`, `state`, `country`, `profilePicture`, `meansOfIdType`, `meansOfIdNumber`, `selfieImage`, `socialMediaLinks`.
