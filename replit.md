# MoversPadi

A Next.js 16 web application for the MoversPadi platform — a ride/haulage/dispatch service connecting customers to movers.

## Architecture

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **State**: Zustand
- **Maps**: Leaflet / React-Leaflet, Pigeon Maps, Google Maps API
- **Animations**: Framer Motion
- **HTTP**: Axios + custom fetch-based API client

## Project Structure

```
app/          # Next.js App Router pages (admin, auth, company, mover)
src/
  application/    # Use-cases / application logic
  components/     # Shared UI components
  config/         # App configuration
  context/        # React context providers
  domain/         # Domain models / types
  infrastructure/ # API clients and external integrations
  lib/            # Utility functions
  modules/        # Feature modules (auth, etc.)
  globals.css     # Global styles
types/        # Shared TypeScript type definitions
public/       # Static assets
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` — Backend API origin (e.g. `https://moverspadi.onrender.com`). If not set, the app uses built-in dummy data for development.

## Running Locally

```bash
npm run dev    # starts on port 5000 (Replit-compatible)
npm run build  # production build
npm run start  # production server on port 5000
```

## Replit Configuration

- Dev server binds to `0.0.0.0:5000` so Replit's preview iframe can reach it
- `next.config.ts` sets `allowedDevOrigins: ["*"]` for cross-origin iframe compatibility
- Workflow: **Start application** → `npm run dev`
