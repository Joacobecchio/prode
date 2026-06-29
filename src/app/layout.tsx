import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/app-shell";
import { Providers } from "@/components/providers";
import { PwaRegister } from "@/components/pwa-register";
import { ThemeScript } from "@/components/theme-script";
import { getAuthContext } from "@/lib/auth/session";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prode",
  description: "Prode de futbol argentino entre amigos.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Prode",
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#11251b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await getAuthContext();
  const viewer = auth.user
    ? {
        email: auth.profile?.email ?? auth.user.email ?? auth.user.phone ?? "",
        nickname:
          auth.profile?.nickname ??
          auth.user.email?.split("@")[0] ??
          auth.user.phone ??
          "",
        fullName: auth.profile?.full_name ?? "",
        role: auth.profile?.role ?? "user",
        canManageAdmin: auth.profile?.role === "super_admin",
      }
    : null;

  return (
    <html lang="es-AR" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <Providers>
          <AppShell viewer={viewer}>{children}</AppShell>
          <PwaRegister />
        </Providers>
      </body>
    </html>
  );
}
