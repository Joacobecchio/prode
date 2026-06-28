"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  History,
  LayoutDashboard,
  ListTodo,
  Shield,
  SlidersHorizontal,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Inicio", icon: LayoutDashboard },
  { href: "/partidos", label: "Partidos", icon: ListTodo },
  { href: "/historial", label: "Historial", icon: History },
  { href: "/admin", label: "Admin", icon: SlidersHorizontal },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <header className="sticky top-0 z-30 border-b bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md border bg-primary text-primary-foreground">
              <Shield className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-wide">
                Prode Estrella
              </span>
              <span className="block text-xs text-muted-foreground">
                Futbol argentino
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                    active && "bg-secondary text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 rounded-md border bg-card px-3 py-2 text-xs text-muted-foreground sm:flex">
            <Trophy className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>Estrella 8</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/94 px-3 pb-3 pt-2 backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-4 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 rounded-md text-[11px] text-muted-foreground",
                  active && "bg-secondary text-foreground",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="pointer-events-none fixed bottom-24 right-4 hidden h-12 items-center gap-2 rounded-full border bg-card/90 px-4 text-xs text-muted-foreground shadow-lg lg:flex">
        <CalendarDays className="h-4 w-4 text-accent" aria-hidden="true" />
        Fecha 5 en juego
      </div>
    </div>
  );
}
