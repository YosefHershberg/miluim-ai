"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

const rankKeys: Record<string, string> = {
  NONE: "common.none",
  PLATOON_COMMANDER: "roles.platoonCompany",
  DEPUTY_COMPANY: "roles.deputyCompanyBattalion",
  COMPANY_COMMANDER: "roles.companyDeputyBattalion",
  BATTALION_COMMANDER: "roles.magad",
};

const roleKeys: Record<string, string> = {
  COMBAT: "roles.combat",
  TERRITORIAL_DEFENSE: "roles.territorialDefense",
  SUPPORT: "roles.support",
};

const tierKeys: Record<string, string> = {
  ALEPH_PLUS: "tiers.alephPlus",
  ALEPH: "tiers.aleph",
  BET: "tiers.bet",
  GIMEL: "tiers.gimel",
  DALET: "tiers.dalet",
  HE: "tiers.he",
};

const employmentKeys: Record<string, string> = {
  SALARIED: "profile.salaried",
  SELF_EMPLOYED: "profile.selfEmployed",
  UNEMPLOYED: "profile.unemployed",
  STUDENT: "profile.student",
};

const childrenKeys: Record<string, string> = {
  ZERO: "common.kids0",
  ONE_TO_THREE: "common.kids13",
  FOUR_PLUS: "common.kids4plus",
};

interface ProfileData {
  fullName: string;
  dateOfBirth: string;
  idNumber: string;
  serviceRole: string | null;
  activityTier: string | null;
  commanderRank: string;
  employmentType: string;
  monthlyGrossSalary: number | null;
  annualGrossIncome: number | null;
  hasChildUnder14: boolean;
  childrenUnder18: string;
  isStudent: boolean;
}

export function ProfileView({ profile }: { profile: ProfileData }) {
  const { t, locale } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("profile.title")}</h1>
        <Link
          href="/profile/edit"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 h-7 text-sm font-medium hover:bg-muted hover:text-foreground transition-all"
        >
          <Pencil className="h-3.5 w-3.5" />
          {t("common.edit")}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("profile.personalInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ProfileRow label={t("profile.fullName")} value={profile.fullName} />
          <ProfileRow
            label={t("profile.dateOfBirth")}
            value={new Date(profile.dateOfBirth).toLocaleDateString(locale === "he" ? "he-IL" : "en-US")}
          />
          <ProfileRow label={t("profile.idNumber")} value={profile.idNumber} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("profile.militaryInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ProfileRow
            label={t("profile.role2025")}
            value={profile.serviceRole ? t(roleKeys[profile.serviceRole]) : t("profile.notSelected")}
          />
          <ProfileRow
            label={t("profile.tier2026")}
            value={profile.activityTier ? t(tierKeys[profile.activityTier]) : t("profile.notSelected")}
          />
          <ProfileRow
            label={t("profile.commandRole")}
            value={t(rankKeys[profile.commanderRank])}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("profile.employment")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ProfileRow
            label={t("profile.employmentType")}
            value={t(employmentKeys[profile.employmentType])}
          />
          {profile.employmentType === "SALARIED" && profile.monthlyGrossSalary && (
            <ProfileRow
              label={t("profile.grossSalary")}
              value={`₪${Number(profile.monthlyGrossSalary).toLocaleString()}`}
            />
          )}
          {profile.employmentType === "SELF_EMPLOYED" && profile.annualGrossIncome && (
            <ProfileRow
              label={t("profile.annualIncome")}
              value={`₪${Number(profile.annualGrossIncome).toLocaleString()}`}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("profile.familyStatus")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ProfileRow
            label={t("profile.childUnder14")}
            value={
              <Badge variant={profile.hasChildUnder14 ? "default" : "secondary"}>
                {profile.hasChildUnder14 ? t("common.yes") : t("common.no")}
              </Badge>
            }
          />
          <ProfileRow
            label={t("profile.childrenUnder18")}
            value={t(childrenKeys[profile.childrenUnder18])}
          />
          <ProfileRow
            label={t("profile.isStudent")}
            value={
              <Badge variant={profile.isStudent ? "default" : "secondary"}>
                {profile.isStudent ? t("common.yes") : t("common.no")}
              </Badge>
            }
          />
        </CardContent>
      </Card>
    </div>
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
