# MiluimAI

## Project Overview
AI-powered application for IDF reserve duty (miluim) management. Early stage — built on the Next.js 16 + React 19 starter.

## Tech Stack
- **Framework**: Next.js 16.2.1 (App Router)
- **UI**: React 19, Tailwind CSS v4, Geist font
- **Language**: TypeScript (strict mode)
- **Auth/Backend**: Supabase (`@supabase/supabase-js` + `@supabase/ssr`)
- **Database**: Prisma 7 (`@prisma/client` + `@prisma/adapter-pg`) with Supabase Postgres
- **Env Validation**: `@t3-oss/env-nextjs` + Zod — all env vars defined in `src/env.ts`
- **Styling**: Tailwind via `@tailwindcss/postcss` — use `@theme inline` for custom tokens (see `globals.css`)
- **Linting**: ESLint 9 flat config with `next/core-web-vitals` + `next/typescript`

## Critical: Next.js 16 is NOT the version you know
Read the relevant guide in `node_modules/next/dist/docs/` **before** writing any Next.js code. APIs, conventions, and file structure have breaking changes from prior versions. Heed deprecation notices.

## Commands
```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure
```
src/
  app/
    layout.tsx        # Root layout (Geist fonts, global CSS)
    page.tsx          # Home page (protected, shows user + sign out)
    actions.ts        # Root server actions (signOut)
    globals.css       # Tailwind import + CSS custom properties
    login/
      page.tsx        # Login page (client component)
      actions.ts      # Login server action
    signup/
      page.tsx        # Signup page (client component)
      actions.ts      # Signup server action
    auth/
      callback/
        route.ts      # OAuth/magic-link callback handler
  env.ts              # T3 Env — validated env vars (single source of truth)
  generated/prisma/   # Generated Prisma client (gitignored, `prisma generate` recreates)
  lib/
    prisma.ts         # Prisma singleton client (uses PrismaPg adapter)
    supabase/
      client.ts       # Browser Supabase client (createBrowserClient)
      server.ts       # Server Supabase client (createServerClient + cookies)
      proxy.ts        # Session refresh helper for proxy
  proxy.ts            # Next.js 16 proxy (replaces middleware.ts)
prisma/
  schema.prisma       # Prisma schema — models and datasource
prisma.config.ts      # Prisma v7 config (datasource URL from env.ts)
public/               # Static assets (SVGs)
```

## Database
- **Before writing any DB-related code**, read `prisma/schema.prisma` to understand the current models and relationships
- Prisma v7 requires a driver adapter — the singleton in `src/lib/prisma.ts` handles this with `@prisma/adapter-pg`
- Supabase Auth manages users (`auth.users`) — do NOT create a Prisma model for users/auth
- `prisma.config.ts` loads env vars from `src/env.ts` (not raw `process.env`)
- Migrations: `npx prisma migrate dev --name <name>` — uses `DIRECT_URL` (port 5432, no pooler)
- Client generation: `npx prisma generate` (runs automatically in `npm run build`)

## Authentication
- Supabase Auth with email/password (Supabase project: `miluim-ai`)
- Session refresh via `proxy.ts` (Next.js 16 proxy, NOT middleware)
- Unauthenticated users are redirected to `/login` (except `/login`, `/signup`, `/auth/*`)
- Auth callback at `/auth/callback` handles code exchange for OAuth/magic-link flows
- Env vars validated in `src/env.ts` — import `env` from `@/env` (never use raw `process.env`)

## Maintaining This File
After every major change (new pages/routes, added dependencies, new architectural patterns, API integrations, database setup, auth, etc.), update this CLAUDE.md to reflect the current state. Keep the Tech Stack, Project Structure, and Conventions sections accurate so future sessions start with correct context.

## Conventions
- Path alias: `@/*` maps to `./src/*`
- Use App Router patterns (server components by default, `"use client"` only when needed)
- Tailwind v4 syntax: `@import "tailwindcss"` and `@theme inline` for design tokens — no `tailwind.config` file
- Dark mode via `prefers-color-scheme` media query with CSS custom properties
- Next.js 16: use `proxy.ts` (not `middleware.ts`) — export named `proxy` function
- Supabase clients: use `@/lib/supabase/server` in server components/actions, `@/lib/supabase/client` in client components
- Server actions pattern: co-locate `actions.ts` next to the page that uses them
- Env vars: always import from `@/env` — never use `process.env` directly in app code
- Prisma: import `prisma` from `@/lib/prisma`, import types from `@/generated/prisma/client`
