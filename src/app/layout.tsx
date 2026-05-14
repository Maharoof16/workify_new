import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import WorkifySidebar from "@/components/sidebar/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Manrope } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";

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
    <html lang="en" className={`${manrope.variable}`}>
      <body className="bg-background">
        <TooltipProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <WorkifySidebar />

              <div className="flex flex-1 flex-col">
                {/* Mobile Topbar */}
                <header className="flex h-14 items-center border-b px-4 md:hidden">
                  <SidebarTrigger />
                </header>

                <main className="flex-1 overflow-auto p-4 md:p-6">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
