import { requireProfile } from "@/lib/auth";
import { getServicePeriodsByUserId } from "@/data-access/service-periods";
import { ServicePeriodsList } from "@/components/service-periods/service-periods-list";

export default async function ServicePeriodsPage() {
  const { user } = await requireProfile();
  const periods = await getServicePeriodsByUserId(user.id);

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <ServicePeriodsList periods={JSON.parse(JSON.stringify(periods))} />
      </div>
    </main>
  );
}
