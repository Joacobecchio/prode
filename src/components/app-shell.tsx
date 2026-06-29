"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  History,
  LayoutDashboard,
  ListTodo,
  LogOut,
  SlidersHorizontal,
  Star,
  UserRound,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOutAction } from "@/lib/auth/actions";
import type { AppRole } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

type AppShellViewer = {
  email: string;
  nickname: string;
  fullName: string;
  role: AppRole;
  canManageAdmin: boolean;
} | null;

const navItems = [
  { href: "/", label: "Inicio", icon: LayoutDashboard },
  { href: "/partidos", label: "Partidos", icon: ListTodo },
  { href: "/historial", label: "Historial", icon: History },
  { href: "/admin", label: "Admin", icon: SlidersHorizontal },
];

export function AppShell({
  children,
  viewer,
}: {
  children: React.ReactNode;
  viewer: AppShellViewer;
}) {
  const pathname = usePathname();
  const visibleNavItems =
    viewer?.canManageAdmin
      ? navItems
      : navItems.filter((item) => item.href !== "/admin");

  function isActive(href: string) {
    return href === "/" ? pathname === href : pathname.startsWith(href);
  }

  if (!viewer) {
    return (
      <div className="min-h-screen">
        <header className="border-b border-border/60 bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
            <Link href="/login" className="flex shrink-0 items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary">
                <Star
                  className="h-4 w-4 fill-primary-foreground text-primary-foreground"
                  aria-hidden="true"
                />
              </span>
              <span className="font-black tracking-tight text-foreground">
                Prode
              </span>
            </Link>

            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5 mr-4">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary">
              <Star className="h-4 w-4 fill-primary-foreground text-primary-foreground" aria-hidden="true" />
            </span>
            <span className="hidden font-black tracking-tight text-foreground sm:block">
              Prode
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center gap-0.5 md:flex">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex h-8 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/12 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />

            <Link
              href="/perfil"
              className="hidden items-center gap-2 rounded-xl border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary sm:flex"
            >
              <UserRound className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              {viewer.nickname || viewer.email}
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border bg-card px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:block">Salir</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* ── Mobile bottom nav ──────────────────────────────────── */}
      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/94 pb-safe-area-inset-bottom backdrop-blur-xl md:hidden"
      >
        <div
          className="grid gap-1 px-2 pb-2 pt-1"
          style={{
            gridTemplateColumns: `repeat(${visibleNavItems.length}, minmax(0, 1fr))`,
          }}
        >
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-semibold tracking-wide transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon
                  className={cn("h-5 w-5", active && "stroke-[2.5]")}
                  aria-hidden="true"
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Live round pill (desktop) ───────────────────────────── */}
      <div className="pointer-events-none fixed bottom-6 right-6 hidden items-center gap-2 rounded-full border border-accent/20 bg-card/90 px-4 py-2 text-xs font-medium text-muted-foreground shadow-lg backdrop-blur lg:flex">
        <CalendarDays className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
        Fecha 5 en juego
      </div>
    </div>
  );
}
