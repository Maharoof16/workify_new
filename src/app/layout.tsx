import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import WorkifySidebar from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Manrope } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "@/components/providers/provider";
import { TOAST_POSITION } from "@/lib/config";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Workify",
  description: "HRMS Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable}`} suppressHydrationWarning>
      <body className="bg-background">
        <Providers toastPosition={TOAST_POSITION}>{children}</Providers>
      </body>
    </html>
  );
}
