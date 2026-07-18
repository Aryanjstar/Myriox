import Link from "next/link";

import { LogoMark } from "@/components/brand/logo-mark";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Why Myriox", href: "#why-myriox" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Personas",
    links: [
      { label: "Rushed commuter", href: "/dashboard" },
      { label: "Wheelchair user", href: "/dashboard" },
      { label: "Delivery worker", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Sign up", href: "/sign-up" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2 text-base font-semibold tracking-tight">
              <LogoMark className="size-6" />
              Myriox
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Autonomous multi-agent simulation for site planning and user flow — stress-test
              a layout before the concrete sets.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Myriox. All simulations are estimates, not certifications.</span>
          <span>Built on Azure OpenAI, LangGraph, and Cosmos DB.</span>
        </div>
      </div>
    </footer>
  );
}
