"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useTranslation } from "@/lib/i18n";
import { signOut } from "@/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MobileSidebar } from "./mobile-sidebar";

const NAV_ITEMS = [
  { href: "/dashboard", labelKey: "nav.dashboard" },
  { href: "/service-periods", labelKey: "nav.myMiluim" },
  { href: "/benefits", labelKey: "nav.myEntitlements" },
  { href: "/profile", labelKey: "nav.profile" },
];

interface NavbarProps {
  userName: string;
}

export function Navbar({ userName }: NavbarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto max-w-5xl flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Shield className="h-5 w-5 text-primary" />
          <span>{t("app.name")}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname.startsWith(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-full h-8 w-8 hover:bg-muted transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/profile" className="w-full">{t("nav.profile")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut()}
                className="text-destructive"
              >
                {t("nav.signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <MobileSidebar userName={userName} />
        </div>
      </nav>
    </header>
  );
}
