# MiluimAI — Project Instructions

## Overview

MiluimAI is a Next.js web application that calculates grants, benefits, and rights for Israeli army reservists. It uses AI (Gemini API) to extract service period data from official 3010 PDF documents, stores user profiles and service history in Supabase PostgreSQL via Prisma ORM, and computes all eligible benefits based on Israeli government frameworks.

## Key Documents

- **`PRD.md`** — Product Requirements Document. Contains all features, routes, database schema, architecture, and UX requirements. **Update this file after every major feature addition or change.**
- **`CALCULATIONS.md`** — Complete calculation reference for all grants and benefits. Contains every formula, rate, threshold, and worked example. **This is the single source of truth for all benefit calculations. Never deviate from it.**
- **`example-files-3010/`** — Sample 3010 PDF documents for testing AI extraction.

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Supabase PostgreSQL + Supabase Auth (Google OAuth)
- Prisma 7 ORM (schema at `prisma/schema.prisma`, generated client at `src/generated/prisma/`)
- shadcn/ui + Tailwind CSS v4 + Framer Motion
- Google Gemini API (`@google/genai`) for PDF data extraction
- Zod for validation
- next-themes for dark/light mode
- Custom i18n (Hebrew + English) at `src/lib/i18n/`

## Architecture

```
src/
├── app/           # Next.js pages and layouts (App Router)
│   ├── (auth)/    # Login, OAuth callback (public routes)
│   └── (app)/     # Authenticated routes (dashboard, profile, etc.)
├── components/    # React components
│   ├── ui/        # shadcn/ui primitives
│   ├── layout/    # Navbar, sidebar
│   └── [feature]/ # Feature-specific components
├── services/      # Business logic (calculations, AI extraction)
├── data-access/   # Prisma database operations
├── actions/       # Next.js Server Actions
├── lib/           # Shared utilities (supabase, prisma, i18n, utils)
└── env.ts         # Environment variable validation
```

## Key Patterns

- **Server Components by default** — only use `"use client"` where interactivity is needed
- **Server Actions** for all mutations (forms, deletes)
- **Services layer** for business logic — pure functions, no DB access
- **Data-access layer** for all Prisma queries — always verify userId ownership
- **Zod validation** on all form inputs (server-side)

## Calculations

All benefit calculations MUST follow `CALCULATIONS.md` exactly:
- Section 3: Core NII compensation (daily rate formula, adjusted days table, min/max rates)
- Section 4: 2025 wartime benefits (role-based: Combat/Territorial/Support)
- Section 5: 2026 wartime benefits (tier-based: א+ through ה)
- Section 6: Business owner compensation

Key rates (2026): Min daily rate = 328.76 NIS, Max = 1,730.33 NIS, Credit point value = 2,904 NIS.

## UI/UX Rules

- Hebrew primary language, RTL layout
- Heebo font (supports Hebrew + Latin)
- Dark mode: dark-ish (zinc/slate tones, not pure black)
- Desktop: top navbar | Mobile: sidebar (Sheet component)
- Loading states for all async operations
- Delete confirmation dialogs (shadcn Dialog)
- Framer Motion for page transitions and card animations
- Responsive down to 375px

## Constraints

- Users must authenticate before accessing any feature
- Users must create a profile before adding service periods
- PDF files are NOT stored — only extracted data
- All monetary amounts in NIS
- Include disclaimer that calculations are informational only

## Database

Tables: `user_profiles`, `service_periods` (see `prisma/schema.prisma` for full schema).
Supabase handles `auth.users` — our `UserProfile.userId` references `auth.users.id`.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build (runs prisma generate first)
npx prisma generate  # Regenerate Prisma client
npx prisma db push   # Push schema to database
npx prisma studio    # Open Prisma Studio
```

## Keeping Docs in Sync

After every major change:
1. Update `PRD.md` if features, routes, or schema changed
2. Update this file (`CLAUDE.md`) if architecture or patterns changed
3. Never modify `CALCULATIONS.md` unless rates/formulas are officially updated
