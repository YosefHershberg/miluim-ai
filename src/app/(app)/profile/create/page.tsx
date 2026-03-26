import { requireAuth } from "@/lib/auth";
import { getUserProfileByUserId } from "@/data-access/user-profile";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/profile-form";
import { ProfileCreateHeader } from "@/components/profile/profile-page-header";
import { createProfile } from "@/actions/profile";

export default async function CreateProfilePage() {
  const user = await requireAuth();
  const existing = await getUserProfileByUserId(user.id);
  if (existing) redirect("/dashboard");

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <ProfileCreateHeader />
        <ProfileForm action={createProfile} submitLabelKey="profile.createButton" />
      </div>
    </main>
  );
}
