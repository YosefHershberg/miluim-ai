import type { UserProfile, ServicePeriod } from "@/generated/prisma/client";
import type { BenefitResult } from "../benefits-calculator";
import {
  getTotalDaysInYear,
  getDaysWarStartToEndOfYear,
  getTotalTzav8Days,
  getCreditPoints,
} from "./helpers";
import { RATES_2026, CREDIT_POINT_VALUE, CALENDAR_GRANT, TIER_INDEX, type Tier2026 } from "./constants";

function getTier(profile: UserProfile): Tier2026 {
  return (profile.activityTier as Tier2026) || "HE";
}

/** Linearly interpolate rate between א+ (max) and ה (min) for a given tier */
function graduatedRate(tier: Tier2026, maxRate: number, minRate: number): number {
  const idx = TIER_INDEX[tier];
  if (idx === 0) return maxRate;
  if (idx === 5) return minRate;
  return Math.round(maxRate - (idx * (maxRate - minRate)) / 5);
}

/** 5.1 Special Compensation */
export function specialCompensation2026(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const tier = getTier(profile);
  const daysToEnd2025 = getDaysWarStartToEndOfYear(periods, 2025);
  const days2026 = getTotalDaysInYear(periods, 2026);
  const totalForThreshold = daysToEnd2025 + days2026;

  if (totalForThreshold < RATES_2026.thresholds.specialCompMin) {
    return b("special-comp-2026", "התגמול המיוחד", "Special Compensation", "direct", null,
      "תגמול מיוחד לשנת 2026", `נדרשים 32+ ימים, יש ${totalForThreshold}`,
      false, `נדרשים 32+ ימים`, "2026", "5.1");
  }

  const { maxRate, minRate } = RATES_2026.specialCompensation;
  const rate = graduatedRate(tier, maxRate, minRate);
  const amount = days2026 * rate;
  return b("special-comp-2026", "התגמול המיוחד", "Special Compensation", "direct", amount,
    "תגמול מיוחד — כל ימי 2026 לאחר חציית סף 32",
    `${days2026} ימים × ${rate} ₪/יום = ${amount.toLocaleString()} ₪`,
    true, undefined, "2026", "5.1", "מאי השנה הבאה");
}

/** 5.2 Calendar Grant */
export function calendarGrant2026(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const days2026 = getTotalDaysInYear(periods, 2026);

  if (days2026 < CALENDAR_GRANT.minDays) {
    return b("calendar-grant-2026", "המענק הקלנדרי", "Calendar Grant", "direct", null,
      "מענק קלנדרי", `נדרשים 10+ ימים, יש ${days2026}`,
      false, `נדרשים 10+ ימים`, "2026", "5.2");
  }

  let points: number;
  if (days2026 >= 80) points = 2.0;
  else if (days2026 >= 30) points = 1.5;
  else points = 1.0;

  const grossAmount = Math.round(CREDIT_POINT_VALUE * points);
  const netAmount = Math.round(grossAmount * 0.75);

  return b("calendar-grant-2026", "המענק הקלנדרי", "Calendar Grant", "direct", netAmount,
    "מענק קלנדרי — לאחר 25% מס",
    `${points} נקודות × ${CREDIT_POINT_VALUE} ₪ = ${grossAmount} ₪ ברוטו, נטו: ${netAmount} ₪`,
    true, undefined, "2026", "5.2", "מאי השנה הבאה");
}

/** 5.3 Enhanced Personal Expenses — per-day on ALL days */
export function personalExpenses2026(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const tier = getTier(profile);
  const days2026 = getTotalDaysInYear(periods, 2026);
  const { maxRate, minRate } = RATES_2026.personalExpenses;
  const rate = graduatedRate(tier, maxRate, minRate);

  if (days2026 === 0) {
    return b("personal-expenses-2026", "מענק הוצאות אישיות מוגדל", "Enhanced Personal Expenses", "direct", null,
      "מענק הוצאות אישיות מוגדל", "אין ימי שירות ב-2026",
      false, "אין ימי שירות", "2026", "5.3");
  }

  const amount = days2026 * rate;
  return b("personal-expenses-2026", "מענק הוצאות אישיות מוגדל", "Enhanced Personal Expenses", "direct", amount,
    "מענק הוצאות אישיות מוגדל — לפי יום על כל הימים",
    `${days2026} ימים × ${rate} ₪/יום = ${amount.toLocaleString()} ₪`,
    true, undefined, "2026", "5.3");
}

/** 5.4 Enhanced Family Grant — per-day on ALL days */
export function familyGrant2026(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const tier = getTier(profile);
  const days2026 = getTotalDaysInYear(periods, 2026);
  const { maxRate, minRate } = RATES_2026.familyGrant;
  const rate = graduatedRate(tier, maxRate, minRate);

  if (!profile.hasChildUnder14) {
    return b("family-grant-2026", "מענק משפחה מוגדל", "Enhanced Family Grant", "direct", null,
      "מענק משפחה מוגדל", "נדרש ילד עד גיל 14",
      false, "אין ילד עד גיל 14", "2026", "5.4");
  }

  if (days2026 === 0) {
    return b("family-grant-2026", "מענק משפחה מוגדל", "Enhanced Family Grant", "direct", null,
      "מענק משפחה מוגדל", "אין ימי שירות ב-2026",
      false, "אין ימי שירות", "2026", "5.4");
  }

  const amount = days2026 * rate;
  return b("family-grant-2026", "מענק משפחה מוגדל", "Enhanced Family Grant", "direct", amount,
    "מענק משפחה מוגדל — לפי יום על כל הימים",
    `${days2026} ימים × ${rate} ₪/יום = ${amount.toLocaleString()} ₪`,
    true, undefined, "2026", "5.4");
}

/** 5.5 Digital Wallet — א+ only, 3-tier */
export function digitalWallet2026(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const tier = getTier(profile);
  const days2026 = getTotalDaysInYear(periods, 2026);
  const { tier1Rate, tier2Rate, tier3Rate, tier1MaxDays, tier2MaxDays, maxAmount } = RATES_2026.digitalWallet;

  if (tier !== "ALEPH_PLUS") {
    return b("digital-wallet-2026", "ארנק דיגיטלי", "Digital Wallet", "redeemable", null,
      "ארנק דיגיטלי פייטר", "מדרג א+ בלבד",
      false, "מדרג א+ בלבד", "2026", "5.5");
  }

  if (days2026 === 0) {
    return b("digital-wallet-2026", "ארנק דיגיטלי", "Digital Wallet", "redeemable", null,
      "ארנק דיגיטלי פייטר", "אין ימי שירות ב-2026",
      false, "אין ימי שירות", "2026", "5.5");
  }

  let amount = 0;
  if (days2026 <= tier1MaxDays) {
    amount = days2026 * tier1Rate;
  } else if (days2026 <= tier2MaxDays) {
    amount = tier1MaxDays * tier1Rate + (days2026 - tier1MaxDays) * tier2Rate;
  } else {
    amount = tier1MaxDays * tier1Rate + (tier2MaxDays - tier1MaxDays) * tier2Rate + (days2026 - tier2MaxDays) * tier3Rate;
  }
  amount = Math.min(amount, maxAmount);

  return b("digital-wallet-2026", "ארנק דיגיטלי", "Digital Wallet", "redeemable", amount,
    `ארנק דיגיטלי — ימים 1-${tier1MaxDays}: ${tier1Rate}₪, ${tier1MaxDays + 1}-${tier2MaxDays}: ${tier2Rate}₪, ${tier2MaxDays + 1}+: ${tier3Rate}₪, תקרה ${maxAmount.toLocaleString()}₪`,
    `${days2026} ימים → ${amount.toLocaleString()} ₪`,
    true, undefined, "2026", "5.5");
}

/** 5.6 Tax Credit Points — א+ only */
export function taxCredits2026(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const tier = getTier(profile);
  const days2026 = getTotalDaysInYear(periods, 2026);

  if (tier !== "ALEPH_PLUS") {
    return b("tax-credits-2026", "נקודות זיכוי במס", "Tax Credit Points", "redeemable", null,
      "נקודות זיכוי במס", "מדרג א+ בלבד",
      false, "מדרג א+ בלבד", "2026", "5.6");
  }

  if (days2026 < RATES_2026.thresholds.taxCreditsMin) {
    return b("tax-credits-2026", "נקודות זיכוי במס", "Tax Credit Points", "redeemable", null,
      "נקודות זיכוי במס", `נדרשים 30+ ימים, יש ${days2026}`,
      false, `נדרשים 30+ ימים`, "2026", "5.6");
  }

  const points = getCreditPoints(days2026);
  const amount = Math.round(points * CREDIT_POINT_VALUE);

  return b("tax-credits-2026", "נקודות זיכוי במס", "Tax Credit Points", "redeemable", amount,
    "נקודות זיכוי במס הכנסה",
    `${points} נקודות × ${CREDIT_POINT_VALUE} ₪ = ${amount.toLocaleString()} ₪`,
    true, undefined, "2026", "5.6", "מוחל בשנת המס הבאה");
}

/** 5.7 Household Maintenance */
export function householdGrant2026(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const tier = getTier(profile);
  const days2026 = getTotalDaysInYear(periods, 2026);
  const { base, enhancedTotal } = RATES_2026.householdMaintenance;

  const isEnhanced = tier === "ALEPH_PLUS" && days2026 >= RATES_2026.thresholds.householdEnhancedMin;
  const amount = isEnhanced ? enhancedTotal : base;

  return b("household-2026", "מענק כלכלת הבית", "Household Maintenance Grant", "direct", amount,
    isEnhanced ? "מענק כלכלת הבית מוגדל (א+ 45+ ימים)" : "מענק כלכלת הבית בסיסי",
    `${amount.toLocaleString()} ₪`, true, undefined, "2026", "5.7");
}

/** 5.8 Commander Grant */
export function commanderGrant2026(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const tier = getTier(profile);
  const days2026 = getTotalDaysInYear(periods, 2026);
  const rank = profile.commanderRank;
  const threshold = profile.isStudent
    ? RATES_2026.thresholds.commanderStudentMin
    : RATES_2026.thresholds.commanderMin;

  if (tier !== "ALEPH_PLUS" || rank === "NONE") {
    return b("commander-grant-2026", "מענק מפקדים", "Commander Grant", "direct", null,
      "מענק מפקדים", "נדרש מדרג א+ ותפקיד פיקודי",
      false, "אין תפקיד פיקודי / לא מדרג א+", "2026", "5.8");
  }

  if (days2026 < threshold) {
    return b("commander-grant-2026", "מענק מפקדים", "Commander Grant", "direct", null,
      "מענק מפקדים", `נדרשים ${threshold}+ ימים, יש ${days2026}`,
      false, `נדרשים ${threshold}+ ימים`, "2026", "5.8");
  }

  const amount = RATES_2026.commanderGrants[rank] || 0;

  return b("commander-grant-2026", "מענק מפקדים", "Commander Grant", "direct", amount,
    "מענק מפקדים", `${amount.toLocaleString()} ₪`,
    true, undefined, "2026", "5.8");
}

/** 5.9 Vacation Voucher */
export function vacationVoucher2026(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const tier = getTier(profile);
  const days2026 = getTotalDaysInYear(periods, 2026);
  const { maxAmount, minAmount } = RATES_2026.vacationVoucher;

  if (days2026 < RATES_2026.thresholds.vacationVoucherMin) {
    return b("vacation-2026", "שובר חופשה", "Vacation Voucher", "redeemable", null,
      "שובר חופשה", `נדרשים 60+ ימים, יש ${days2026}`,
      false, `נדרשים 60+ ימים`, "2026", "5.9");
  }

  if (!profile.hasChildUnder14) {
    return b("vacation-2026", "שובר חופשה", "Vacation Voucher", "redeemable", null,
      "שובר חופשה", "נדרש ילד עד גיל 14",
      false, "אין ילד עד גיל 14", "2026", "5.9");
  }

  const amount = graduatedRate(tier, maxAmount, minAmount);
  return b("vacation-2026", "שובר חופשה", "Vacation Voucher", "redeemable", amount,
    "שובר חופשה — בתוקף עד 31/12/2028",
    `${amount.toLocaleString()} ₪`, true, undefined, "2026", "5.9", "בתוקף עד 31/12/2028");
}

/** 5.17 Amit Program */
export function amitProgram2026(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const totalDays = getTotalTzav8Days(periods);
  if (totalDays < RATES_2026.thresholds.amitProgramMin) {
    return b("amit-2026", "תוכנית עמית", "Amit Program", "redeemable", null,
      "תוכנית עמית", `נדרשים 30+ ימים`, false, `נדרשים 30+ ימים`, "2026", "5.17");
  }
  return b("amit-2026", "תוכנית עמית", "Amit Program", "redeemable", null,
    "תוכנית עמית — 12,000 מטבעות לסדנאות וקורסים",
    "12,000 מטבעות", true, undefined, "2026", "5.17");
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function b(
  id: string, nameHe: string, nameEn: string,
  category: "direct" | "redeemable", amount: number | null,
  description: string, calculationBreakdown: string,
  eligible: boolean, ineligibleReason?: string,
  framework?: "2025" | "2026", section?: string, paymentDate?: string
): BenefitResult {
  return {
    id, nameHe, nameEn, category, amount, description, calculationBreakdown,
    eligible, ineligibleReason, framework: framework || "2026", section: section || "",
    paymentDate,
  };
}

export function getAll2026Benefits(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult[] {
  return [
    specialCompensation2026(profile, periods),
    calendarGrant2026(profile, periods),
    personalExpenses2026(profile, periods),
    familyGrant2026(profile, periods),
    digitalWallet2026(profile, periods),
    taxCredits2026(profile, periods),
    householdGrant2026(profile, periods),
    commanderGrant2026(profile, periods),
    vacationVoucher2026(profile, periods),
    amitProgram2026(profile, periods),
  ];
}
