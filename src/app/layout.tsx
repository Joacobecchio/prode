import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/app-shell";
import { Providers } from "@/components/providers";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prode Estrella",
  description: "Prode de futbol argentino entre amigos.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Prode Estrella",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className="dark">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
          <PwaRegister />
        </Providers>
      </body>
    </html>
  );
}
