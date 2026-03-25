import { requireProfile } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import Link from "next/link";

const rankLabels: Record<string, string> = {
  NONE: "ללא",
  PLATOON_COMMANDER: 'מ"מ/מ"פ',
  DEPUTY_COMPANY: 'סמ"פ/סמג"ד',
  COMPANY_COMMANDER: 'מ"פ/סג"ד',
  BATTALION_COMMANDER: 'מג"ד',
};

const roleLabels: Record<string, string> = {
  COMBAT: "לוחם",
  TERRITORIAL_DEFENSE: "הגנה מרחבית",
  SUPPORT: "תומך/עורפי",
};

const tierLabels: Record<string, string> = {
  ALEPH_PLUS: "א+",
  ALEPH: "א",
  BET: "ב",
  GIMEL: "ג",
  DALET: "ד",
  HE: "ה",
};

const employmentLabels: Record<string, string> = {
  SALARIED: "שכיר",
  SELF_EMPLOYED: "עצמאי",
  UNEMPLOYED: "לא עובד",
  STUDENT: "סטודנט",
};

const childrenLabels: Record<string, string> = {
  ZERO: "0",
  ONE_TO_THREE: "1-3",
  FOUR_PLUS: "4+",
};

export default async function ProfilePage() {
  const { profile } = await requireProfile();

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">פרופיל</h1>
          <Link
            href="/profile/edit"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 h-7 text-sm font-medium hover:bg-muted hover:text-foreground transition-all"
          >
            <Pencil className="h-3.5 w-3.5" />
            ערוך
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">פרטים אישיים</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProfileRow label="שם מלא" value={profile.fullName} />
            <ProfileRow
              label="תאריך לידה"
              value={new Date(profile.dateOfBirth).toLocaleDateString("he-IL")}
            />
            <ProfileRow label="תעודת זהות" value={profile.idNumber} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">פרטים צבאיים</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProfileRow
              label="תפקיד (מתווה 2025)"
              value={profile.serviceRole ? roleLabels[profile.serviceRole] : "לא נבחר"}
            />
            <ProfileRow
              label="מדרג פעילות (מתווה 2026)"
              value={profile.activityTier ? tierLabels[profile.activityTier] : "לא נבחר"}
            />
            <ProfileRow
              label="תפקיד פיקודי"
              value={rankLabels[profile.commanderRank]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">תעסוקה</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProfileRow
              label="סוג תעסוקה"
              value={employmentLabels[profile.employmentType]}
            />
            {profile.employmentType === "SALARIED" && profile.monthlyGrossSalary && (
              <ProfileRow
                label="שכר ברוטו חודשי"
                value={`₪${Number(profile.monthlyGrossSalary).toLocaleString()}`}
              />
            )}
            {profile.employmentType === "SELF_EMPLOYED" && profile.annualGrossIncome && (
              <ProfileRow
                label="הכנסה שנתית"
                value={`₪${Number(profile.annualGrossIncome).toLocaleString()}`}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">מצב משפחתי</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProfileRow
              label="ילד עד גיל 14"
              value={
                <Badge variant={profile.hasChildUnder14 ? "default" : "secondary"}>
                  {profile.hasChildUnder14 ? "כן" : "לא"}
                </Badge>
              }
            />
            <ProfileRow
              label="ילדים עד גיל 18"
              value={childrenLabels[profile.childrenUnder18]}
            />
            <ProfileRow
              label="סטודנט"
              value={
                <Badge variant={profile.isStudent ? "default" : "secondary"}>
                  {profile.isStudent ? "כן" : "לא"}
                </Badge>
              }
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
