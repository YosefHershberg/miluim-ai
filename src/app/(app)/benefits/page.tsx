import { requireProfile } from "@/lib/auth";
import { getServicePeriodsByUserId } from "@/data-access/service-periods";
import { calculateAllBenefits, getTotalDirectAmount } from "@/services/benefits-calculator";
import { BenefitsView } from "@/components/benefits/benefits-view";

export default async function BenefitsPage() {
  const { user, profile } = await requireProfile();
  const periods = await getServicePeriodsByUserId(user.id);
  const benefits = calculateAllBenefits(profile, periods);
  const totalDirect = getTotalDirectAmount(benefits);

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <BenefitsView
          benefits={JSON.parse(JSON.stringify(benefits))}
          totalDirect={totalDirect}
        />
      </div>
    </main>
  );
}
