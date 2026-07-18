"use client";

import Link from "next/link";

import { useAuth } from "@/components/auth/auth-provider";
import { LogoMark } from "@/components/brand/logo-mark";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) {
    return <span className="hidden text-xs text-muted-foreground sm:inline">Signed out</span>;
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="hidden text-right leading-tight sm:block">
        <p className="text-xs font-medium text-foreground">{user.name}</p>
        <p className="text-[11px] text-muted-foreground">{user.org_name}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={logout}>
        Log out
      </Button>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-mesh flex min-h-screen flex-col bg-grid-glow">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <LogoMark className="size-6" />
            Myriox
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <UserMenu />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
