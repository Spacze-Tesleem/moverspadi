# MoversPadi

A Next.js 16 web application for the MoversPadi platform — a fleetless logistics marketplace connecting customers to dispatch, haulage, tow, and transport providers.

## Architecture

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **State**: Zustand (persisted to localStorage)
- **Maps**: Leaflet / React-Leaflet, Pigeon Maps, Google Maps API
- **Animations**: Framer Motion
- **HTTP**: Custom fetch-based API client with Bearer token auth

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
- `next.config.ts` sets `allowedDevOrigins: ["*"]`
- Workflow: **Start application** → `npm run dev`
