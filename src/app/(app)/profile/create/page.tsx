import { requireAuth } from "@/lib/auth";
import { getUserProfileByUserId } from "@/data-access/user-profile";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/profile-form";
import { createProfile } from "@/actions/profile";

export default async function CreateProfilePage() {
  const user = await requireAuth();
  const existing = await getUserProfileByUserId(user.id);
  if (existing) redirect("/dashboard");

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">יצירת פרופיל</h1>
        <p className="text-center text-muted-foreground mb-8">
          מלא את הפרטים שלך כדי לחשב את ההטבות המגיעות לך
        </p>
        <ProfileForm action={createProfile} submitLabel="צור פרופיל" />
      </div>
    </main>
  );
}
