# MiluimAI - Product Requirements Document

> **Version:** 1.0
> **Last Updated:** March 25, 2026
> **Status:** Draft

---

## 1. Overview

### 1.1 Problem Statement

Israeli army reservists are eligible for numerous grants, benefits, and rights from various government organizations (NII, IDF, Tax Authority, Ministry of Defense). Calculating these benefits is complex due to:

- Multiple frameworks (2025 vs 2026) with different classification systems
- Role/tier-based rate variations
- Day-count thresholds that unlock different benefits
- Benefits scattered across organizations with different payment timelines
- Manual parameter entry required on existing tools (no data persistence)

### 1.2 Solution

MiluimAI is a web application that:

1. **Authenticates users** via Google OAuth (Supabase)
2. **Stores user profiles** with relevant parameters for benefit calculations
3. **Extracts service period data** from official 3010 PDF documents using AI (Gemini API)
4. **Calculates all eligible grants, benefits, and rights** based on the user's profile and service history
5. **Displays results** categorized by payment type with amounts, dates, and calculation breakdowns

### 1.3 Target Users

- Active IDF reservists who have served under emergency orders (tzav 8)
- Both salaried employees, self-employed, and unemployed/student reservists

---

## 2. User Profile Parameters

### 2.1 Personal Information

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Full Name | text | Yes | Display only |
| Date of Birth | date | Yes | For age-based eligibility |
| ID Number (ת.ז.) | text | Yes | 9-digit Israeli ID |

### 2.2 Military Information

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Commander Rank | select | No | None / מ"מ/מ"פ / סמ"פ/סמג"ד / מ"פ/סג"ד / מג"ד |

### 2.3 Employment Information

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Employment Type | select | Yes | Salaried (שכיר) / Self-employed (עצמאי) / Unemployed (לא עובד) / Student (סטודנט) |
| Monthly Gross Salary | number | Conditional | Required for salaried; used for NII core compensation |
| Annual Gross Income | number | Conditional | Required for self-employed |

### 2.4 Family Information

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Has child under 14 | boolean | Yes | Family grant eligibility |
| Number of children under 18 | select | Yes | 0 / 1-3 / 4+ |
| Is student (current year) | boolean | Yes | Student benefits eligibility |

---

## 3. Service Periods

### 3.1 Service Period Data Model

Each service period contains:

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| Start Date | date | Extracted from 3010 | |
| End Date | date | Extracted from 3010 | |
| Total Days | number | Extracted from 3010 | |
| Is Emergency Order (tzav 8) | boolean | User confirms | Default true for wartime periods |
| Role (2025 framework) | select | User selects | Combat / Territorial Defense / Support |
| Activity Tier (2026 framework) | select | User selects | א+ / א / ב / ג / ד / ה |

### 3.2 3010 Document Processing

- User uploads one or more 3010 PDF files
- Gemini API extracts: start date, end date, total days for each period in the document
- Multiple files can be processed simultaneously (parallel processing via Promise.allSettled)
- If parallel processing fails, fall back to sequential with progress indicator
- The PDF files themselves are NOT stored — only extracted data is saved
- User reviews extracted data before confirming save

### 3.3 Framework Auto-Detection

The system automatically determines which framework applies:
- **2025 Framework:** Service periods in 2024-2025, using role classification (Combat / Territorial / Support)
- **2026 Framework:** Service periods spanning into 2026+, using 6-tier activity system (א+ through ה)
- Days from war start (Oct 7, 2023) through end of 2025 are counted for the "historical days" input in both frameworks

---

## 4. Benefits Calculation Engine

### 4.1 Calculation Reference

All calculations are defined in `CALCULATIONS.md`. The engine must implement every benefit listed in sections 3-6 of that document.

### 4.2 Core NII Compensation (Section 3)

- Calculate daily rate from gross salary / income
- Apply adjusted service days formula (remainder conversion table)
- Enforce min/max rates (328.76 / 1,730.33 NIS/day for 2026)
- Handle salaried, self-employed, and unemployed/student cases
- Apply Amendment 253 rules for consecutive service periods

### 4.3 Wartime Benefits - 2025 Framework (Section 4)

All benefits from sections 4.1 through 4.22:
- Special Compensation (role-based rates)
- Calendar Grant (credit-point-based)
- Enhanced Personal Expenses Grant (10-day blocks from day 40)
- Enhanced Family Grant (10-day blocks from day 40, child under 14)
- Digital Wallet Grant (combat only, tiered daily rates)
- Tax Credit Points (combat only, 30+ days)
- Household Maintenance Grant
- Commander Grant (rank-based)
- Vacation Voucher (180+ days)
- Camp Grant, Babysitter Refund, Camp Refund
- Mental Health Treatment, Personal & Couples Therapy
- Household Services Refund
- Moving Expenses, Pet Kennel, Highway 6, Vehicle License
- Complementary Medicine, Amit Program, Persistence Grant

### 4.4 Wartime Benefits - 2026 Framework (Section 5)

All benefits from sections 5.1 through 5.18:
- Same categories as 2025 but with tier-based rates instead of role-based
- New per-day calculation (no 10-day blocks)
- New Digital Wallet formula (3 tiers)
- New benefits: Maternity Leave Extension, Spouse Absence Days, Organizing Days

### 4.5 Business Owner Compensation (Section 6)

- Flag eligibility for self-employed users
- Display guidance (consult tax professional) rather than precise calculation
- Link to Tax Authority tools

---

## 5. Benefits Display

### 5.1 Categories

Benefits are displayed in three tabs:

1. **All Benefits (כל ההטבות)** — Complete list
2. **Direct to Account (ישירות לחשבון)** — Monetary amounts deposited automatically
3. **Redeemable (במימוש)** — Benefits requiring active claiming

### 5.2 Benefit Card Structure

Each benefit card shows:
- Benefit name (Hebrew + English)
- Amount in NIS (calculated)
- Payment/availability date
- Calculation breakdown (expandable)
- Eligibility status (eligible / not eligible with reason)
- Category badge (Direct / Redeemable)
- Action link (where to claim, if applicable)

### 5.3 Summary

- Total monetary value of all "Direct to Account" benefits
- Donut/pie chart visualization of benefit breakdown
- Export capability (future consideration)

---

## 6. Application Routes

| Route | Description | Auth Required | Profile Required |
|-------|-------------|---------------|-----------------|
| `/` | Landing page / Login | No | No |
| `/auth/callback` | OAuth callback handler | No | No |
| `/dashboard` | Main dashboard - total days, yearly breakdown, quick links | Yes | Yes |
| `/profile` | View profile parameters with edit button | Yes | Yes |
| `/profile/edit` | Edit profile form | Yes | Yes |
| `/profile/create` | Create profile form (first-time setup) | Yes | No |
| `/service-periods` | List all service periods with add/delete | Yes | Yes |
| `/service-periods/add` | Upload 3010 PDFs, AI extraction flow | Yes | Yes |
| `/benefits` | Full benefits calculation and display | Yes | Yes |

---

## 7. Dashboard

The main dashboard displays:
- User name and key profile parameters (with edit button)
- Total days served (all time)
- Days served by year breakdown (e.g., "2025: 132 days", "2024: 171 days")
- Quick link cards to: Benefits, Service Periods, Profile
- Current framework indicator

---

## 8. Technical Architecture

### 8.1 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** Supabase PostgreSQL
- **ORM:** Prisma 7
- **Authentication:** Supabase Auth (Google OAuth)
- **AI:** Google Gemini API (@google/genai)
- **UI:** shadcn/ui + Tailwind CSS v4
- **Animations:** Framer Motion
- **Validation:** Zod
- **i18n:** Custom context-based (Hebrew + English)
- **Theming:** next-themes (light/dark mode)

### 8.2 Folder Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth group (login, callback)
│   ├── (app)/                    # Authenticated app group
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── service-periods/
│   │   └── benefits/
│   ├── layout.tsx
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # shadcn components
│   ├── layout/                   # Navbar, Sidebar, Footer
│   ├── dashboard/                # Dashboard-specific components
│   ├── profile/                  # Profile form components
│   ├── service-periods/          # Service period components
│   └── benefits/                 # Benefits display components
├── lib/
│   ├── supabase/                 # Supabase client config
│   ├── prisma.ts                 # Prisma client singleton
│   ├── i18n/                     # Internationalization
│   └── utils.ts                  # Utility functions
├── services/                     # Business logic layer
│   ├── benefits-calculator.ts    # Core calculation engine
│   ├── document-processor.ts     # 3010 PDF extraction via Gemini
│   └── profile.ts                # Profile business logic
├── data-access/                  # Database operations
│   ├── user-profile.ts
│   ├── service-periods.ts
│   └── types.ts
├── actions/                      # Server Actions
│   ├── profile.ts
│   ├── service-periods.ts
│   └── auth.ts
└── env.ts                        # Environment validation
```

### 8.3 Database Schema

```
UserProfile
├── id                  UUID (PK, default uuid)
├── userId              TEXT (unique, references auth.users.id)
├── fullName            TEXT
├── dateOfBirth         DATE
├── idNumber            TEXT (unique)
├── commanderRank       ENUM (NONE, PLATOON_COMMANDER, DEPUTY_COMPANY, COMPANY_COMMANDER, BATTALION_COMMANDER)
├── employmentType      ENUM (SALARIED, SELF_EMPLOYED, UNEMPLOYED, STUDENT)
├── monthlyGrossSalary  DECIMAL (nullable)
├── annualGrossIncome   DECIMAL (nullable)
├── hasChildUnder14     BOOLEAN
├── childrenUnder18     ENUM (ZERO, ONE_TO_THREE, FOUR_PLUS)
├── isStudent           BOOLEAN
├── createdAt           TIMESTAMP
└── updatedAt           TIMESTAMP

ServicePeriod
├── id                  UUID (PK, default uuid)
├── userProfileId       UUID (FK -> UserProfile.id)
├── startDate           DATE
├── endDate             DATE
├── totalDays           INTEGER
├── isEmergencyOrder    BOOLEAN (default true)
├── role                ENUM (COMBAT, TERRITORIAL_DEFENSE, SUPPORT) (nullable)
├── activityTier        ENUM (ALEPH_PLUS, ALEPH, BET, GIMEL, DALET, HE) (nullable)
├── createdAt           TIMESTAMP
└── updatedAt           TIMESTAMP
```

### 8.4 Key Architectural Decisions

- **Server Actions** for all mutations (create/update/delete profile, add/delete service periods)
- **Services layer** for business logic (calculations, AI extraction) — pure functions where possible
- **Data-access layer** for all Prisma queries — thin wrapper functions
- **Client components** only where interactivity is needed (forms, modals, animations)
- **Server components** by default for data fetching and rendering

---

## 9. UX/UI Requirements

### 9.1 Visual Design

- Google Font (not Geist — choose a clean, modern font that supports Hebrew well, e.g., Heebo or Assistant)
- Dark mode: dark-ish (not pure black, use zinc/slate tones)
- Light mode: clean white/gray
- Responsive: mobile-first design
- RTL support (Hebrew primary)

### 9.2 Navigation

- **Desktop:** Top navbar with links (Dashboard, Profile, Service Periods, Benefits)
- **Mobile:** Sidebar (Sheet component) with hamburger menu
- Theme toggle (light/dark) in navbar
- Language toggle (HE/EN) in navbar

### 9.3 Interaction Patterns

- **Loading states:** Skeleton loaders for async data fetching
- **AI extraction:** Infinite progress bar during Gemini processing with status text
- **Delete confirmation:** Modal dialog before deleting service periods
- **Form validation:** Inline Zod validation with error messages
- **Animations:** Framer Motion for page transitions, card entrances, progress indicators
- **Toast notifications:** Sonner for success/error feedback

### 9.4 Upload Flow (Add Service Period)

1. User clicks "Add Period" button
2. File upload dropzone appears (accepts PDF, multiple files)
3. Upload state: file names shown with upload progress
4. AI Extraction state: infinite loading bar, "Extracting data from document..." text
5. Extraction complete: show extracted data (dates, days) for user review
6. User selects role/tier for each period
7. User confirms and saves
8. Redirect to service periods list with success toast

---

## 10. Constraints

1. User CANNOT create a service period without a completed profile
2. User CANNOT access any authenticated feature without logging in
3. PDF files are NOT stored — only extracted data
4. All monetary amounts are in NIS
5. Calculations follow CALCULATIONS.md strictly
6. The app does NOT replace professional financial/legal advice (disclaimer required)

---

## 11. Future Considerations (Out of Scope for v1)

- Push notifications for upcoming benefit payment dates
- Export benefits summary to PDF
- Integration with NII/Tax Authority APIs (if available)
- Sharing benefits summary
- Historical rate tracking (rates change annually)
- Multi-user household support (spouse benefits)
