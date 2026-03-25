/**
 * Calculation constants — single source of truth for all rates, thresholds, and tables.
 * See CALCULATIONS.md for documentation and legal references.
 * Last updated: January 1, 2026
 */

// ---------------------------------------------------------------------------
// Section 3: NII Core Compensation Rates (ביטוח לאומי)
// ---------------------------------------------------------------------------

export const NII_RATES = {
  /** Minimum daily compensation rate (NIS) */
  minDaily: 328.76,
  /** Maximum daily compensation rate (NIS) */
  maxDaily: 1730.33,
  /** Minimum monthly equivalent (NIS) */
  minMonthly: 9863,
  /** Maximum monthly equivalent (NIS) */
  maxMonthly: 51910,
  /** Basic monthly amount (סכום בסיסי) — max = 5×, min = 95% */
  basicMonthly: 10382,
  /** Young worker (נער עובד) minimum daily rate */
  youngWorkerMinDaily: 114.73,
} as const;

/**
 * Adjusted service days remainder table (Section 3.1).
 * Divide total days by 7; full weeks count 1:1, remainder maps here.
 */
export const ADJUSTED_DAYS_REMAINDER: Record<number, number> = {
  0: 0,
  1: 1.4,
  2: 2.4,
  3: 4.2,
  4: 4.2,
  5: 7.0,
  6: 7.0,
};

// ---------------------------------------------------------------------------
// Tax Credit Points (Sections 4.6 / 5.6)
// ---------------------------------------------------------------------------

/** Annual value of one credit point (NIS) — 2026 */
export const CREDIT_POINT_VALUE = 2904;

/**
 * Credit points by days served — applies to both 2025 (combat) and 2026 (tier א+).
 * Threshold is inclusive minimum; entries ordered descending.
 */
export const CREDIT_POINTS_SCHEDULE: readonly [minDays: number, points: number][] = [
  [110, 4.0],
  [105, 3.75],
  [100, 3.5],
  [95, 3.25],
  [90, 3.0],
  [85, 2.75],
  [80, 2.5],
  [75, 2.25],
  [70, 2.0],
  [65, 1.75],
  [60, 1.5],
  [55, 1.25],
  [50, 1.0],
  [40, 0.75],
  [30, 0.5],
];

/** Look up credit points for a given number of service days. Returns 0 if below threshold. */
export function getCreditPoints(days: number): number {
  for (const [minDays, points] of CREDIT_POINTS_SCHEDULE) {
    if (days >= minDays) return points;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Calendar Grant — all roles/tiers (Sections 4.2 / 5.2)
// ---------------------------------------------------------------------------

export const CALENDAR_GRANT = {
  minDays: 10,
  /** Points: [minDays, creditPoints] ordered descending */
  schedule: [
    [80, 2.0],
    [30, 1.5],
    [10, 1.0],
  ] as readonly [number, number][],
} as const;

// ---------------------------------------------------------------------------
// Section 4: 2025 Framework Rates (מתווה 2025)
// ---------------------------------------------------------------------------

export type Role2025 = "COMBAT" | "TERRITORIAL_DEFENSE" | "SUPPORT";

export const RATES_2025 = {
  /** Section 4.1: Special compensation per day (NIS) */
  specialCompensation: {
    COMBAT: 133,
    TERRITORIAL_DEFENSE: 60,
    SUPPORT: 40,
  } as Record<Role2025, number>,

  /** Section 4.3: Enhanced personal expenses per 10-day block from day 40 (NIS) */
  personalExpenses: {
    COMBAT: 466,
    TERRITORIAL_DEFENSE: 310,
    SUPPORT: 266,
  } as Record<Role2025, number>,

  /** Section 4.4: Enhanced family grant per 10-day block from day 40, child<14 (NIS) */
  familyGrant: {
    COMBAT: 833,
    TERRITORIAL_DEFENSE: 600,
    SUPPORT: 500,
  } as Record<Role2025, number>,

  /** Section 4.5: Digital wallet — combat only */
  digitalWallet: {
    tier1Rate: 30,      // days 1–30
    tier2Rate: 80,      // days 31+
    tier1MaxDays: 30,
    maxAmount: 5000,
  },

  /** Section 4.7: Household maintenance (NIS) */
  householdMaintenance: {
    base: 1250,
    enhancedExtra: 1250,  // additional for combat with 45+ days
  },

  /** Section 4.8: Commander grants (NIS) */
  commanderGrants: {
    BATTALION_COMMANDER: 20000,
    COMPANY_COMMANDER: 10000,
    DEPUTY_COMPANY: 5000,
    PLATOON_COMMANDER: 5000,
  } as Record<string, number>,

  /** Section 4.9: Vacation voucher (NIS) — 180+ days */
  vacationVoucher: {
    combat: 7000,
    other: 3350,
  },

  /** Section 4.19: Vehicle license discount (NIS) */
  vehicleLicense: {
    standard: 129,    // 10% — 30+ days
    extended: 193,    // 15% — 180+ days
  },

  /** Eligibility thresholds (days) */
  thresholds: {
    specialCompMin: 32,
    calendarGrantMin: 10,
    personalExpensesFrom: 40,
    familyGrantFrom: 40,
    digitalWalletMin: 10,
    taxCreditsMin: 30,
    householdEnhancedMin: 45,
    commanderMin: 60,
    commanderStudentMin: 40,
    vacationVoucherMin: 180,
    campGrantMin: 5,
    vehicleLicenseStandard: 30,
    vehicleLicenseExtended: 180,
    amitProgramMin: 30,
  },
} as const;

// ---------------------------------------------------------------------------
// Section 5: 2026 Framework Rates (מתווה 2026)
// ---------------------------------------------------------------------------

export type Tier2026 = "ALEPH_PLUS" | "ALEPH" | "BET" | "GIMEL" | "DALET" | "HE";

/** Tier index for graduated rate interpolation (0 = highest, 5 = lowest) */
export const TIER_INDEX: Record<Tier2026, number> = {
  ALEPH_PLUS: 0,
  ALEPH: 1,
  BET: 2,
  GIMEL: 3,
  DALET: 4,
  HE: 5,
};

export const RATES_2026 = {
  /** Section 5.1: Special compensation — graduated א+ (133) to ה (30) NIS/day */
  specialCompensation: { maxRate: 133, minRate: 30 },

  /** Section 5.3: Personal expenses — graduated א+ (46) to ה (11) NIS/day, ALL days */
  personalExpenses: { maxRate: 46, minRate: 11 },

  /** Section 5.4: Family grant child<14 — graduated א+ (83) to ה (21) NIS/day, ALL days */
  familyGrant: { maxRate: 83, minRate: 21 },

  /** Section 5.5: Digital wallet — א+ only, 3-tier */
  digitalWallet: {
    tier1Rate: 45,   // days 1–30
    tier2Rate: 120,  // days 31–45
    tier3Rate: 70,   // days 46+
    tier1MaxDays: 30,
    tier2MaxDays: 45,
    maxAmount: 5000,
  },

  /** Section 5.7: Household maintenance (NIS) */
  householdMaintenance: {
    base: 1250,
    enhancedTotal: 2500,  // א+ with 45+ days
  },

  /** Section 5.8: Commander grants — same as 2025, א+ only */
  commanderGrants: {
    BATTALION_COMMANDER: 20000,
    COMPANY_COMMANDER: 10000,
    DEPUTY_COMPANY: 5000,
    PLATOON_COMMANDER: 5000,
  } as Record<string, number>,

  /** Section 5.9: Vacation voucher — graduated א+ (4500) to ה (1030) NIS */
  vacationVoucher: { maxAmount: 4500, minAmount: 1030 },

  /** Section 5.10: Babysitter refund */
  babysitter: {
    alephPlusDaily: 100,
    alephPlusMonthCap: 2000,
    alephPlusYearCap: 8000,
    heDaily: 80,
    heTotal: 2000,
    shaagatHaariBonus: { alephPlus: 1500, he: 1000 },
  },

  /** Section 5.12: Moving expenses — א+ with 1+ day in 2026 */
  movingExpenses: 2500,

  /** Section 5.14: Maternity leave extension (NEW 2026) */
  maternityExtension: {
    amount: 10700,
    minDays: 45,
    maternityDaysRequired: 21,
  },

  /** Eligibility thresholds (days) */
  thresholds: {
    specialCompMin: 32,
    calendarGrantMin: 10,
    taxCreditsMin: 30,
    householdEnhancedMin: 45,
    commanderMin: 60,
    commanderStudentMin: 40,
    vacationVoucherMin: 60,
    amitProgramMin: 30,
  },
} as const;
