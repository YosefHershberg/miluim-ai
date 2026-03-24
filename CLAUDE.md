# MiluimAI

## Project Overview
AI-powered application for IDF reserve duty (miluim) management. Early stage — built on the Next.js 16 + React 19 starter.

## Tech Stack
- **Framework**: Next.js 16.2.1 (App Router)
- **UI**: React 19, Tailwind CSS v4, Geist font
- **Language**: TypeScript (strict mode)
- **Auth/Backend**: Supabase (`@supabase/supabase-js` + `@supabase/ssr`)
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
  lib/
    supabase/
      client.ts       # Browser Supabase client (createBrowserClient)
      server.ts       # Server Supabase client (createServerClient + cookies)
      proxy.ts        # Session refresh helper for proxy
  proxy.ts            # Next.js 16 proxy (replaces middleware.ts)
public/               # Static assets (SVGs)
```

## Authentication
- Supabase Auth with email/password (Supabase project: `miluim-ai`)
- Session refresh via `proxy.ts` (Next.js 16 proxy, NOT middleware)
- Unauthenticated users are redirected to `/login` (except `/login`, `/signup`, `/auth/*`)
- Auth callback at `/auth/callback` handles code exchange for OAuth/magic-link flows
- Env vars in `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

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
