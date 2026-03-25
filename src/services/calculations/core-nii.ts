import type { UserProfile, ServicePeriod } from "@/generated/prisma/client";
import { calculateAdjustedDays } from "./helpers";
import type { BenefitResult } from "../benefits-calculator";
import { NII_RATES } from "./constants";

/** Calculate daily rate based on employment and income */
export function calculateDailyRate(
  employmentType: string,
  monthlySalary: number | null,
  annualIncome: number | null
): number {
  let dailyRate: number;

  if (employmentType === "SALARIED" && monthlySalary) {
    // 3-month gross / 90
    dailyRate = (monthlySalary * 3) / 90;
  } else if (employmentType === "SELF_EMPLOYED" && annualIncome) {
    // Annual / 360
    dailyRate = annualIncome / 360;
  } else {
    // Unemployed / Student — minimum rate
    return NII_RATES.minDaily;
  }

  // Enforce min/max
  return Math.max(NII_RATES.minDaily, Math.min(NII_RATES.maxDaily, dailyRate));
}

/** Core NII compensation for all service periods (Section 3) */
export function calculateCoreCompensation(
  profile: UserProfile,
  periods: ServicePeriod[]
): BenefitResult {
  const tzav8Periods = periods.filter((p) => p.isEmergencyOrder);
  if (tzav8Periods.length === 0) {
    return {
      id: "core-compensation",
      nameHe: "תגמול מילואים",
      nameEn: "Core Reservist Compensation",
      category: "direct",
      amount: 0,
      description: "תגמול מילואים מביטוח לאומי",
      calculationBreakdown: "אין תקופות שירות בצו 8",
      eligible: false,
      ineligibleReason: "אין תקופות שירות",
      framework: "2025",
      section: "3.1",
    };
  }

  const salary = profile.monthlyGrossSalary
    ? Number(profile.monthlyGrossSalary)
    : null;
  const income = profile.annualGrossIncome
    ? Number(profile.annualGrossIncome)
    : null;

  const dailyRate = calculateDailyRate(
    profile.employmentType,
    salary,
    income
  );

  const totalDays = tzav8Periods.reduce((sum, p) => sum + p.totalDays, 0);
  const adjustedDays = calculateAdjustedDays(totalDays);
  const amount = Math.round(dailyRate * adjustedDays);

  return {
    id: "core-compensation",
    nameHe: "תגמול מילואים",
    nameEn: "Core Reservist Compensation",
    category: "direct",
    amount,
    description: "תגמול מילואים מביטוח לאומי עבור כל ימי השירות בצו 8",
    calculationBreakdown: `תעריף יומי: ${dailyRate.toFixed(2)} ₪ × ${adjustedDays} ימים מתואמים (${totalDays} ימים בפועל) = ${amount.toLocaleString()} ₪`,
    eligible: true,
    paymentDate: "משולם דרך המעסיק / ישירות מביטוח לאומי",
    framework: "2025",
    section: "3.1",
  };
}
