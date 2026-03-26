import type { UserProfile, ServicePeriod } from "@/generated/prisma/client";
import type { BenefitResult } from "../benefits-calculator";
import {
  getTotalDaysInYear,
  getDays2024Plus2025,
  getTenDayBlocks,
  getTotalTzav8Days,
  getCreditPoints,
} from "./helpers";
import { RATES_2025, CREDIT_POINT_VALUE, CALENDAR_GRANT, type Role2025 } from "./constants";

function getRole(profile: UserProfile): Role2025 {
  return (profile.serviceRole as Role2025) || "SUPPORT";
}

/** 4.1 Special Compensation */
export function specialCompensation2025(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const role = getRole(profile);
  const total2024_2025 = getDays2024Plus2025(periods);
  const days2025 = getTotalDaysInYear(periods, 2025);

  if (total2024_2025 < RATES_2025.thresholds.specialCompMin) {
    return benefit("special-comp-2025", "התגמול המיוחד", "Special Compensation", "direct", null,
      "תגמול מיוחד לשנת 2025", `נדרשים 32+ ימים (2024+2025), יש לך ${total2024_2025}`,
      false, `נדרשים 32+ ימים, יש ${total2024_2025}`, "2025", "4.1");
  }

  const rate = RATES_2025.specialCompensation[role];
  const amount = days2025 * rate;
  return benefit("special-comp-2025", "התגמול המיוחד", "Special Compensation", "direct", amount,
    "תגמול מיוחד משולם על כל ימי 2025 לאחר חציית סף 32 יום",
    `${days2025} ימים × ${rate} ₪/יום = ${amount.toLocaleString()} ₪`,
    true, undefined, "2025", "4.1", "1 במאי 2026");
}

/** 4.2 Calendar Grant */
export function calendarGrant2025(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const days2025 = getTotalDaysInYear(periods, 2025);

  if (days2025 < CALENDAR_GRANT.minDays) {
    return benefit("calendar-grant-2025", "המענק הקלנדרי", "Calendar Grant", "direct", null,
      "מענק קלנדרי", `נדרשים 10+ ימים, יש ${days2025}`,
      false, `נדרשים 10+ ימים בשנה`, "2025", "4.2");
  }

  let points: number;
  if (days2025 >= 80) points = 2.0;
  else if (days2025 >= 30) points = 1.5;
  else points = 1.0;

  const amount = Math.round(CREDIT_POINT_VALUE * points);

  return benefit("calendar-grant-2025", "המענק הקלנדרי", "Calendar Grant", "direct", amount,
    "מענק קלנדרי (ברוטו, לפני 25% מס)",
    `${points} נקודות זיכוי × ${CREDIT_POINT_VALUE} ₪ = ${amount.toLocaleString()} ₪`,
    true, undefined, "2025", "4.2", "1 במאי 2026");
}

/** 4.3 Enhanced Personal Expenses */
export function personalExpenses2025(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const role = getRole(profile);
  const days2025 = getTotalDaysInYear(periods, 2025);
  const { personalExpensesFrom } = RATES_2025.thresholds;

  if (days2025 < personalExpensesFrom) {
    return benefit("personal-expenses-2025", "מענק הוצאות אישיות מוגדל", "Enhanced Personal Expenses", "direct", null,
      "מענק הוצאות אישיות מוגדל", `נדרשים 40+ ימים ב-2025, יש ${days2025}`,
      false, `נדרשים 40+ ימי צו 8 ב-2025`, "2025", "4.3");
  }

  const rate = RATES_2025.personalExpenses[role];
  const blocks = getTenDayBlocks(days2025, personalExpensesFrom);
  const amount = blocks * rate;
  return benefit("personal-expenses-2025", "מענק הוצאות אישיות מוגדל", "Enhanced Personal Expenses", "direct", amount,
    "מענק הוצאות אישיות מוגדל מיום 40",
    `${blocks} בלוקים של 10 ימים × ${rate} ₪ = ${amount.toLocaleString()} ₪`,
    true, undefined, "2025", "4.3", "ראשון לחודש בזמן השירות");
}

/** 4.4 Enhanced Family Grant */
export function familyGrant2025(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const role = getRole(profile);
  const days2025 = getTotalDaysInYear(periods, 2025);
  const { familyGrantFrom } = RATES_2025.thresholds;

  if (!profile.hasChildUnder14) {
    return benefit("family-grant-2025", "מענק משפחה מוגדל", "Enhanced Family Grant", "direct", null,
      "מענק משפחה מוגדל", "נדרש ילד עד גיל 14",
      false, "אין ילד עד גיל 14", "2025", "4.4");
  }

  if (days2025 < familyGrantFrom) {
    return benefit("family-grant-2025", "מענק משפחה מוגדל", "Enhanced Family Grant", "direct", null,
      "מענק משפחה מוגדל", `נדרשים 40+ ימים ב-2025, יש ${days2025}`,
      false, `נדרשים 40+ ימי צו 8 ב-2025`, "2025", "4.4");
  }

  const rate = RATES_2025.familyGrant[role];
  const blocks = getTenDayBlocks(days2025, familyGrantFrom);
  const amount = blocks * rate;
  return benefit("family-grant-2025", "מענק משפחה מוגדל", "Enhanced Family Grant", "direct", amount,
    "מענק משפחה מוגדל מיום 40",
    `${blocks} בלוקים × ${rate} ₪ = ${amount.toLocaleString()} ₪`,
    true, undefined, "2025", "4.4");
}

/** 4.5 Digital Wallet */
export function digitalWallet2025(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const role = getRole(profile);
  const days2025 = getTotalDaysInYear(periods, 2025);
  const { tier1Rate, tier2Rate, tier1MaxDays, maxAmount } = RATES_2025.digitalWallet;

  if (role !== "COMBAT") {
    return benefit("digital-wallet-2025", "ארנק דיגיטלי", "Digital Wallet", "redeemable", null,
      "ארנק דיגיטלי פייטר", "לוחמים בלבד",
      false, "לוחמים בלבד", "2025", "4.5");
  }

  if (days2025 < RATES_2025.thresholds.digitalWalletMin) {
    return benefit("digital-wallet-2025", "ארנק דיגיטלי", "Digital Wallet", "redeemable", null,
      "ארנק דיגיטלי פייטר", `נדרשים 10+ ימים, יש ${days2025}`,
      false, `נדרשים 10+ ימים ב-2025`, "2025", "4.5");
  }

  let amount: number;
  if (days2025 <= tier1MaxDays) {
    amount = days2025 * tier1Rate;
  } else {
    amount = tier1MaxDays * tier1Rate + (days2025 - tier1MaxDays) * tier2Rate;
  }
  amount = Math.min(amount, maxAmount);

  return benefit("digital-wallet-2025", "ארנק דיגיטלי", "Digital Wallet", "redeemable", amount,
    `ארנק דיגיטלי פייטר — ימים 1-${tier1MaxDays}: ${tier1Rate}₪, ${tier1MaxDays + 1}+: ${tier2Rate}₪, תקרה ${maxAmount.toLocaleString()}₪`,
    `${days2025} ימים → ${amount.toLocaleString()} ₪`,
    true, undefined, "2025", "4.5", "בתוקף עד 31/12/2028");
}

/** 4.6 Tax Credit Points */
export function taxCredits2025(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const role = getRole(profile);
  const days2025 = getTotalDaysInYear(periods, 2025);

  if (role !== "COMBAT") {
    return benefit("tax-credits-2025", "נקודות זיכוי במס", "Tax Credit Points", "redeemable", null,
      "נקודות זיכוי במס", "לוחמים בלבד",
      false, "לוחמים בלבד", "2025", "4.6");
  }

  if (days2025 < RATES_2025.thresholds.taxCreditsMin) {
    return benefit("tax-credits-2025", "נקודות זיכוי במס", "Tax Credit Points", "redeemable", null,
      "נקודות זיכוי במס", `נדרשים 30+ ימים, יש ${days2025}`,
      false, `נדרשים 30+ ימים`, "2025", "4.6");
  }

  const points = getCreditPoints(days2025);
  const amount = Math.round(points * CREDIT_POINT_VALUE);

  return benefit("tax-credits-2025", "נקודות זיכוי במס", "Tax Credit Points", "redeemable", amount,
    "נקודות זיכוי במס הכנסה — שנת מס 2026",
    `${points} נקודות × ${CREDIT_POINT_VALUE} ₪ = ${amount.toLocaleString()} ₪`,
    true, undefined, "2025", "4.6", "שנת מס 2026 — דרך טופס 101");
}

/** 4.7 Household Maintenance — base 1,250 for all active reservists */
export function householdGrant2025(
  _profile: UserProfile,
  _periods: ServicePeriod[]
): BenefitResult {
  return benefit("household-2025", "מענק כלכלת הבית", "Household Maintenance Grant", "direct",
    RATES_2025.householdMaintenance.base,
    "מענק למשרת מילואים פעיל",
    `${RATES_2025.householdMaintenance.base.toLocaleString()} ₪`,
    true, undefined, "2025", "4.7", "1 בספטמבר 2025");
}

/** 4.7b Household Maintenance Enhanced — additional 1,250 for combat with 45+ days */
export function householdGrantEnhanced2025(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const role = getRole(profile);
  const days2025 = getTotalDaysInYear(periods, 2025);
  const { householdEnhancedMin } = RATES_2025.thresholds;
  const { enhancedExtra } = RATES_2025.householdMaintenance;

  if (role !== "COMBAT" || days2025 < householdEnhancedMin) {
    return benefit("household-enhanced-2025", "מענק כלכלת הבית המוגדל", "Enhanced Household Grant", "direct", null,
      "מענק כלכלת הבית המוגדל", role !== "COMBAT" ? "לוחמים בלבד" : `נדרשים 45+ ימים ב-2025, יש ${days2025}`,
      false, role !== "COMBAT" ? "לוחמים בלבד" : `נדרשים 45+ ימים ב-2025`, "2025", "4.7");
  }

  return benefit("household-enhanced-2025", "מענק כלכלת הבית המוגדל", "Enhanced Household Grant", "direct", enhancedExtra,
    "מענק כלכלת הבית המוגדל ללוחם עם 45+ ימי צו 8 ב-2025",
    `${enhancedExtra.toLocaleString()} ₪`,
    true, undefined, "2025", "4.7", "1 בספטמבר 2025");
}

/** 4.8 Commander Grant */
export function commanderGrant2025(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const days2025 = getTotalDaysInYear(periods, 2025);
  const rank = profile.commanderRank;
  const threshold = profile.isStudent
    ? RATES_2025.thresholds.commanderStudentMin
    : RATES_2025.thresholds.commanderMin;

  if (rank === "NONE" || getRole(profile) !== "COMBAT") {
    return benefit("commander-grant-2025", "מענק מפקדים", "Commander Grant", "direct", null,
      "מענק מפקדים", "נדרש תפקיד פיקודי בלוחמה",
      false, "אין תפקיד פיקודי / לא לוחם", "2025", "4.8");
  }

  if (days2025 < threshold) {
    return benefit("commander-grant-2025", "מענק מפקדים", "Commander Grant", "direct", null,
      "מענק מפקדים", `נדרשים ${threshold}+ ימים, יש ${days2025}`,
      false, `נדרשים ${threshold}+ ימים`, "2025", "4.8");
  }

  const amount = RATES_2025.commanderGrants[rank] || 0;

  return benefit("commander-grant-2025", "מענק מפקדים", "Commander Grant", "direct", amount,
    `מענק מפקדים — ${rank}`,
    `${amount.toLocaleString()} ₪`,
    true, undefined, "2025", "4.8");
}

/** 4.9 Vacation Voucher */
export function vacationVoucher2025(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const totalTzav8 = getTotalTzav8Days(periods);
  const role = getRole(profile);
  const { vacationVoucherMin, combat, other } = {
    vacationVoucherMin: RATES_2025.thresholds.vacationVoucherMin,
    ...RATES_2025.vacationVoucher,
  };

  if (totalTzav8 < vacationVoucherMin) {
    return benefit("vacation-2025", "שובר חופשה", "Vacation Voucher", "redeemable", null,
      "שובר חופשה", `נדרשים 180+ ימים, יש ${totalTzav8}`,
      false, `נדרשים 180+ ימי צו 8`, "2025", "4.9");
  }

  const amount = role === "COMBAT" ? combat : other;
  const desc = role === "COMBAT" ? "שני שוברים (3,500₪ + 3,500₪)" : "שני שוברים (2,000₪ + 1,350₪)";
  return benefit("vacation-2025", "שובר חופשה", "Vacation Voucher", "redeemable", amount,
    "שובר חופשה — בתוקף עד 31/12/2027",
    `${desc} = ${amount.toLocaleString()} ₪`,
    true, undefined, "2025", "4.9", "בתוקף עד 31/12/2027");
}

/** 4.10 Camp Grant */
export function campGrant2025(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  if (!profile.hasChildUnder14) {
    return benefit("camp-2025", "מענק קייטנות", "Camp Grant", "redeemable", null,
      "מענק קייטנות", "נדרש ילד עד גיל 14", false, "אין ילד עד גיל 14", "2025", "4.10");
  }
  return benefit("camp-2025", "מענק קייטנות", "Camp Grant", "redeemable", 1500,
    "מענק קייטנות — 1,500 ₪ עבור הורים לילד עד 14 עם 5+ ימי שירות ביולי-אוגוסט",
    "1,500 ₪", true, undefined, "2025", "4.10", "1 בספטמבר");
}

/** 4.19 Vehicle License Discount */
export function vehicleLicense2025(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const totalDays = getTotalTzav8Days(periods);
  const { vehicleLicenseStandard, vehicleLicenseExtended } = RATES_2025.thresholds;
  const { standard, extended } = RATES_2025.vehicleLicense;

  if (totalDays < vehicleLicenseStandard) {
    return benefit("vehicle-2025", "הנחה באגרת רישיון רכב", "Vehicle License Discount", "redeemable", null,
      "הנחה באגרת רישיון רכב", `נדרשים 30+ ימים`, false, `נדרשים 30+ ימים`, "2025", "4.19");
  }

  const amount = totalDays >= vehicleLicenseExtended ? extended : standard;
  const pct = totalDays >= vehicleLicenseExtended ? "15%" : "10%";
  return benefit("vehicle-2025", "הנחה באגרת רישיון רכב", "Vehicle License Discount", "redeemable", amount,
    `הנחה ${pct} באגרת רישיון רכב`,
    `${amount} ₪`, true, undefined, "2025", "4.19");
}

/** 4.21 Amit Program */
export function amitProgram2025(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const totalDays = getTotalTzav8Days(periods);
  if (totalDays < RATES_2025.thresholds.amitProgramMin) {
    return benefit("amit-2025", "תוכנית עמית", "Amit Program", "redeemable", null,
      "תוכנית עמית", `נדרשים 30+ ימים`, false, `נדרשים 30+ ימים`, "2025", "4.21");
  }
  return benefit("amit-2025", "תוכנית עמית", "Amit Program", "redeemable", null,
    "תוכנית עמית — 12,000 מטבעות לסדנאות וקורסים, בתוקף עד 31/12/2027",
    "12,000 מטבעות", true, undefined, "2025", "4.21");
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function benefit(
  id: string,
  nameHe: string,
  nameEn: string,
  category: "direct" | "redeemable",
  amount: number | null,
  description: string,
  calculationBreakdown: string,
  eligible: boolean,
  ineligibleReason?: string,
  framework?: "2025" | "2026",
  section?: string,
  paymentDate?: string
): BenefitResult {
  return {
    id, nameHe, nameEn, category, amount, description, calculationBreakdown,
    eligible, ineligibleReason, framework: framework || "2025", section: section || "",
    paymentDate,
  };
}

export function getAll2025Benefits(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult[] {
  return [
    specialCompensation2025(profile, periods),
    calendarGrant2025(profile, periods),
    personalExpenses2025(profile, periods),
    familyGrant2025(profile, periods),
    digitalWallet2025(profile, periods),
    taxCredits2025(profile, periods),
    householdGrant2025(profile, periods),
    householdGrantEnhanced2025(profile, periods),
    commanderGrant2025(profile, periods),
    vacationVoucher2025(profile, periods),
    campGrant2025(profile, periods),
    vehicleLicense2025(profile, periods),
    amitProgram2025(profile, periods),
  ];
}
