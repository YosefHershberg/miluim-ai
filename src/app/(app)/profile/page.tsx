import { requireProfile } from "@/lib/auth";
import { ProfileView } from "@/components/profile/profile-view";

export default async function ProfilePage() {
  const { profile } = await requireProfile();

  const profileData = {
    fullName: profile.fullName,
    dateOfBirth: profile.dateOfBirth.toISOString(),
    idNumber: profile.idNumber,
    serviceRole: profile.serviceRole,
    activityTier: profile.activityTier,
    commanderRank: profile.commanderRank,
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
      <ProfileView profile={profileData} />
    </main>
  );
}
