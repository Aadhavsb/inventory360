# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Inventory360 is a conservation asset management system for Wildlife SOS rescue centres across India. It tracks medical supplies, equipment, vehicles, furniture, machinery, and AV equipment across 13 centres. Built for internal use by Wildlife SOS staff who authenticate via Google OAuth.

## Commands

- `npm run dev` — start dev server with Turbopack (port 3000)
- `npm run build` — production build
- `npm run lint` — ESLint (next/core-web-vitals + next/typescript rules)

No test framework is configured.

## Required Environment Variables

Defined in `.env.local` (not committed):
- `MONGODB_URI` — MongoDB connection string
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL` — NextAuth.js config
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google OAuth credentials

## Architecture

**Next.js 15 App Router** with TypeScript. Uses `@/*` path alias (maps to repo root).

### Routing & Pages

- `/` — landing page (server component)
- `/login` — Google OAuth sign-in, redirects to `/select-profile` after auth
- `/select-profile` — post-login centre + department selection (one-time setup, stored in DB)
- `/inventory` — main dashboard (client-side), checks for user profile on mount

### Constants & Config

`lib/constants.ts` is the single source of truth for centres (13), departments (5), department codes, centre codes, category mappings, and medicine types. All dropdowns and enums reference this file.

### Data Layer

- **MongoDB via Mongoose** — connection cached on `global.mongoose` in `lib/mongodb.ts` (singleton pattern for serverless)
- **Asset model** (`lib/models/Asset.ts`) — single collection with department-based categories. Core fields (name, department, category, status, acquired, date, site, quantity, loggedBy, assetId) plus category-specific optional fields (medicine: compound/companyName/dateOfExpiry/medicineType; medical-equipment: manufacturer/serialNumber/warrantyPeriod/etc.; vehicle: insuranceDueDate/serviceDueDate/repairHistory)
- **UserProfile model** (`lib/models/UserProfile.ts`) — maps email to selected centre + department
- **Validation** (`lib/validation.ts`) — Zod discriminated union on `category` field. Seven category schemas (medicine, medical-supplies, medical-equipment, vehicle, av-equipment, furniture, machinery). Server validates loggedBy separately since discriminatedUnion doesn't support `.extend()`.
- **Asset ID generation** (`lib/assetId.ts`) — format: `{CENTRE_CODE}-{DEPT_CODE}-{YYMMDD}-{SEQ}` (e.g., `DHQ-VET-260412-001`). Generated server-side on POST.

### API Routes (`app/api/`)

- `app/api/asset/route.ts` — GET (with optional department/category/site query params), POST, PUT, DELETE
- `app/api/user-profile/route.ts` — GET (fetch by session email), POST (upsert)
- `app/api/auth/[...nextauth]/route.ts` — NextAuth handler

### Auth

NextAuth.js v4 with Google provider, JWT strategy. Config in `lib/auth.ts`. Session provider wraps the app via `app/providers.tsx` (client component). Rate limiting middleware (`middleware.ts`) applies to all `/api/*` routes.

### Styling

Tailwind CSS with custom `wildlife` color palette in `tailwind.config.js`. Key text colors: `wildlife-green-text` (#3D6B1E) and `wildlife-brown-dark` (#5C2D0E) for WCAG AA compliant body text. Poppins font via `@fontsource/poppins`. Global styles in `app/globals.css`.
