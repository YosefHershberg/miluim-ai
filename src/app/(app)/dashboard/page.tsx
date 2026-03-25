import { requireProfile } from "@/lib/auth";
import { getServicePeriodsByUserId } from "@/data-access/service-periods";
import { aggregateDaysByYear } from "@/services/calculations/helpers";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const { user, profile } = await requireProfile();
  const periods = await getServicePeriodsByUserId(user.id);

  const tzav8Periods = periods.filter((p) => p.isEmergencyOrder);
  const totalDays = tzav8Periods.reduce((sum, p) => sum + p.totalDays, 0);
  const yearBreakdown = aggregateDaysByYear(tzav8Periods);

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <DashboardClient
          fullName={profile.fullName}
          totalDays={totalDays}
          yearBreakdown={yearBreakdown}
          hasPeriods={periods.length > 0}
        />
      </div>
    </main>
  );
}
