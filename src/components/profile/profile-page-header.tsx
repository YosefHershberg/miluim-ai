"use client";

import { useTranslation } from "@/lib/i18n";

export function ProfileCreateHeader() {
  const { t } = useTranslation();
  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6">{t("profile.createTitle")}</h1>
      <p className="text-center text-muted-foreground mb-8">
        {t("profile.createSubtitle")}
      </p>
    </>
  );
}

export function ProfileEditHeader() {
  const { t } = useTranslation();
  return (
    <h1 className="text-2xl font-bold text-center mb-6">{t("profile.editTitle")}</h1>
  );
}
