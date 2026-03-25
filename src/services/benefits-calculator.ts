import type { UserProfile, ServicePeriod } from "@/generated/prisma/client";
import { calculateCoreCompensation } from "./calculations/core-nii";
import { getAll2025Benefits } from "./calculations/wartime-2025";
import { getAll2026Benefits } from "./calculations/wartime-2026";

export interface BenefitResult {
  id: string;
  nameHe: string;
  nameEn: string;
  category: "direct" | "redeemable";
  amount: number | null;
  description: string;
  calculationBreakdown: string;
  eligible: boolean;
  ineligibleReason?: string;
  paymentDate?: string;
  framework: "2025" | "2026";
  section: string;
}

export function calculateAllBenefits(
  profile: UserProfile,
  servicePeriods: ServicePeriod[]
): BenefitResult[] {
  const benefits: BenefitResult[] = [];

  // Core NII compensation (applies regardless of framework)
  benefits.push(calculateCoreCompensation(profile, servicePeriods));

  // 2025 framework benefits (if user has role set)
  if (profile.serviceRole) {
    benefits.push(...getAll2025Benefits(profile, servicePeriods));
  }

  // 2026 framework benefits (if user has tier set)
  if (profile.activityTier) {
    benefits.push(...getAll2026Benefits(profile, servicePeriods));
  }

  return benefits;
}

/** Get total direct-to-account amount */
export function getTotalDirectAmount(benefits: BenefitResult[]): number {
  return benefits
    .filter((b) => b.eligible && b.category === "direct" && b.amount)
    .reduce((sum, b) => sum + (b.amount || 0), 0);
}
