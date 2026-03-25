import { requireProfile } from "@/lib/auth";
import { AddServicePeriodFlow } from "@/components/service-periods/add-flow";

export default async function AddServicePeriodPage() {
  await requireProfile();

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <AddServicePeriodFlow />
      </div>
    </main>
  );
}
