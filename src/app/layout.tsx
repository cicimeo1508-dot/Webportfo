import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DynamicDock } from "@/components/DynamicDock";
import { Footer } from "@/components/Footer";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.role} | Apple OS 26 Portfolio`,
  description: SITE_CONFIG.subtitle,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col selection:bg-apple-blue selection:text-white">
        <ThemeProvider>
          <DynamicDock />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
