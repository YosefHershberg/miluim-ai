"use client";

import { useActionState, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "@/lib/i18n";

interface ProfileFormProps {
  action: (formData: FormData) => Promise<{ error?: Record<string, string[]> } | void>;
  defaultValues?: {
    fullName?: string;
    dateOfBirth?: string;
    idNumber?: string;
    commanderRank?: string;
    serviceRole?: string | null;
    activityTier?: string | null;
    employmentType?: string;
    monthlyGrossSalary?: number | null;
    annualGrossIncome?: number | null;
    hasChildUnder14?: boolean;
    childrenUnder18?: string;
    isStudent?: boolean;
  };
  submitLabelKey: string;
}

export function ProfileForm({ action, defaultValues, submitLabelKey }: ProfileFormProps) {
  const { t } = useTranslation();
  const [state, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      return action(formData);
    },
    null
  );

  const [employmentType, setEmploymentType] = useState(
    defaultValues?.employmentType || "SALARIED"
  );
  const [hasChildUnder14, setHasChildUnder14] = useState(
    defaultValues?.hasChildUnder14 ?? false
  );
  const [isStudent, setIsStudent] = useState(defaultValues?.isStudent ?? false);

  const errors = state?.error || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <form action={formAction} className="space-y-6 max-w-2xl mx-auto">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("profile.personalInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t("profile.fullName")}</Label>
              <Input
                id="fullName"
                name="fullName"
                defaultValue={defaultValues?.fullName}
                required
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">{t("profile.dateOfBirth")}</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                defaultValue={defaultValues?.dateOfBirth}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">{t("profile.idNumber")}</Label>
              <Input
                id="idNumber"
                name="idNumber"
                defaultValue={defaultValues?.idNumber}
                maxLength={9}
                pattern="\d{9}"
                required
              />
              {errors.idNumber && (
                <p className="text-sm text-destructive">{errors.idNumber[0]}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Military Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("profile.militaryInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("profile.role2025")}</Label>
              <Select name="serviceRole" defaultValue={defaultValues?.serviceRole || ""}>
                <SelectTrigger>
                  <SelectValue placeholder={t("profile.selectRole")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COMBAT">{t("roles.combat")}</SelectItem>
                  <SelectItem value="TERRITORIAL_DEFENSE">{t("roles.territorialDefense")}</SelectItem>
                  <SelectItem value="SUPPORT">{t("roles.support")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("profile.tier2026")}</Label>
              <Select name="activityTier" defaultValue={defaultValues?.activityTier || ""}>
                <SelectTrigger>
                  <SelectValue placeholder={t("profile.selectTier")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALEPH_PLUS">{t("tiers.alephPlus")}</SelectItem>
                  <SelectItem value="ALEPH">{t("tiers.aleph")}</SelectItem>
                  <SelectItem value="BET">{t("tiers.bet")}</SelectItem>
                  <SelectItem value="GIMEL">{t("tiers.gimel")}</SelectItem>
                  <SelectItem value="DALET">{t("tiers.dalet")}</SelectItem>
                  <SelectItem value="HE">{t("tiers.he")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("profile.commandRole")}</Label>
              <Select name="commanderRank" defaultValue={defaultValues?.commanderRank || "NONE"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">{t("roles.none")}</SelectItem>
                  <SelectItem value="PLATOON_COMMANDER">{t("roles.mam")}</SelectItem>
                  <SelectItem value="DEPUTY_COMPANY">{t("roles.samap")}</SelectItem>
                  <SelectItem value="COMPANY_COMMANDER">{t("roles.mefakedPluga")}</SelectItem>
                  <SelectItem value="BATTALION_COMMANDER">{t("roles.magad")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("profile.employmentType")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("profile.employmentType")}</Label>
              <Select
                name="employmentType"
                defaultValue={employmentType}
                onValueChange={(v) => v && setEmploymentType(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SALARIED">{t("profile.salaried")}</SelectItem>
                  <SelectItem value="SELF_EMPLOYED">{t("profile.selfEmployed")}</SelectItem>
                  <SelectItem value="UNEMPLOYED">{t("profile.unemployed")}</SelectItem>
                  <SelectItem value="STUDENT">{t("profile.student")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {employmentType === "SALARIED" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label htmlFor="monthlyGrossSalary">{t("profile.grossSalary")}</Label>
                <Input
                  id="monthlyGrossSalary"
                  name="monthlyGrossSalary"
                  type="number"
                  min={0}
                  step={0.01}
                  defaultValue={defaultValues?.monthlyGrossSalary ?? undefined}
                  required
                />
              </motion.div>
            )}

            {employmentType === "SELF_EMPLOYED" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label htmlFor="annualGrossIncome">{t("profile.annualIncome")}</Label>
                <Input
                  id="annualGrossIncome"
                  name="annualGrossIncome"
                  type="number"
                  min={0}
                  step={0.01}
                  defaultValue={defaultValues?.annualGrossIncome ?? undefined}
                  required
                />
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Family Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("profile.familyStatus")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="hasChildUnder14">{t("profile.hasChildUnder14")}</Label>
              <input type="hidden" name="hasChildUnder14" value={hasChildUnder14 ? "true" : "false"} />
              <Switch
                id="hasChildUnder14"
                checked={hasChildUnder14}
                onCheckedChange={setHasChildUnder14}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("profile.childrenUnder18")}</Label>
              <Select name="childrenUnder18" defaultValue={defaultValues?.childrenUnder18 || "ZERO"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ZERO">{t("common.kids0")}</SelectItem>
                  <SelectItem value="ONE_TO_THREE">{t("common.kids13")}</SelectItem>
                  <SelectItem value="FOUR_PLUS">{t("common.kids4plus")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isStudent">{t("profile.isStudent")}</Label>
              <input type="hidden" name="isStudent" value={isStudent ? "true" : "false"} />
              <Switch
                id="isStudent"
                checked={isStudent}
                onCheckedChange={setIsStudent}
              />
            </div>
          </CardContent>
        </Card>

        {state?.error && typeof state.error === "string" && (
          <p className="text-sm text-destructive text-center">{state.error}</p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? t("common.loading") : t(submitLabelKey)}
        </Button>
      </form>
    </motion.div>
  );
}
