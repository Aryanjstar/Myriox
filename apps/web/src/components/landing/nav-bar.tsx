"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/auth/auth-provider";

const LINKS = [
  { href: "#problem", label: "The problem" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#why-myriox", label: "Why Myriox" },
];

function AuthActions({ size = "sm" }: { size?: "sm" | "default" }) {
  const { isLoaded, isSignedIn, user } = useAuth();

  if (!isLoaded) return null;

  if (isSignedIn) {
    return (
      <Button asChild size={size}>
        <Link href="/dashboard">{user?.name?.split(" ")[0] ?? "Dashboard"}</Link>
      </Button>
    );
  }

  return (
    <>
      <Button asChild variant="ghost" size={size}>
        <Link href="/sign-in">Log in</Link>
      </Button>
      <Button asChild size={size}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </>
  );
}

export function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 sm:px-5">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <LogoMark className="size-7" />
          Myriox
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <AuthActions />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="glass mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-2xl p-3 md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-1 flex items-center gap-2">
            <AuthActions />
          </div>
        </div>
      )}
    </header>
  );
}
