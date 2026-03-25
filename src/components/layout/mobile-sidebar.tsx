"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useTranslation } from "@/lib/i18n";
import { signOut } from "@/actions/auth";

const NAV_ITEMS = [
  { href: "/dashboard", labelKey: "nav.dashboard" },
  { href: "/service-periods", labelKey: "nav.myMiluim" },
  { href: "/benefits", labelKey: "nav.myEntitlements" },
  { href: "/profile", labelKey: "nav.profile" },
];

export function MobileSidebar({ userName }: { userName: string }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex items-center justify-center rounded-lg h-8 w-8 hover:bg-muted transition-colors"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {t("app.name")}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                pathname.startsWith(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="flex items-center gap-2 px-3">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        <Separator className="my-4" />

        <div className="px-3 space-y-2">
          <p className="text-sm text-muted-foreground">{userName}</p>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-destructive"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4" />
            {t("nav.signOut")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
