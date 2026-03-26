import { requireProfile } from "@/lib/auth";
import { ProfileForm } from "@/components/profile/profile-form";
import { ProfileEditHeader } from "@/components/profile/profile-page-header";
import { editProfile } from "@/actions/profile";

export default async function EditProfilePage() {
  const { profile } = await requireProfile();

  const defaultValues = {
    fullName: profile.fullName,
    dateOfBirth: new Date(profile.dateOfBirth).toISOString().split("T")[0],
    idNumber: profile.idNumber,
    commanderRank: profile.commanderRank,
    serviceRole: profile.serviceRole,
    activityTier: profile.activityTier,
    employmentType: profile.employmentType,
    monthlyGrossSalary: profile.monthlyGrossSalary
      ? Number(profile.monthlyGrossSalary)
      : null,
    annualGrossIncome: profile.annualGrossIncome
      ? Number(profile.annualGrossIncome)
      : null,
    hasChildUnder14: profile.hasChildUnder14,
    childrenUnder18: profile.childrenUnder18,
    isStudent: profile.isStudent,
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <ProfileEditHeader />
        <ProfileForm
          action={editProfile}
          defaultValues={defaultValues}
          submitLabelKey="profile.saveChanges"
        />
      </div>
    </main>
  );
}
