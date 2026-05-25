import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import WorkifySidebar from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Manrope } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "@/components/providers/provider";
import { TOAST_POSITION } from "@/lib/config";
import { brand } from "@/lib/brand";

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
        <head>
        {/* <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        /> */}
        <style>{`
          :root {
            ${
              brand?.primary
                ? `--primary: ${brand.primary}; 
                  --sidebar-primary: ${brand.primary}; 
                  --sidebar-ring: ${brand.primary}; 
                  --ring: ${brand.primary}; 
                  --accent-foreground: ${brand.primary}; 
                  --spinner-color: ${brand.primary};`
                : ""
            }
            ${
              brand?.primaryForeground
                ? `--primary-foreground: ${brand.primaryForeground}; 
                --sidebar-primary-foreground: ${brand.primaryForeground};`
                : ""
            }
            ${
              brand?.secondary
                ? `--secondary: ${brand.secondary}; 
                --sidebar-secondary: ${brand.secondary}; 
                --accent: ${brand.secondary};
                --sidebar-accent: ${brand.secondary};`
                : ""
            }
            ${
              brand?.secondaryForeground
                ? `--secondary-foreground: ${brand.secondaryForeground}; 
                --sidebar-secondary-foreground: ${brand.secondaryForeground}; 
                --sidebar-accent-foreground: ${brand.secondaryForeground};`
                : ""
            }
          }

          .dark {
            --accent: oklch(0.3523 0 0);
            --sidebar: oklch(0.2850 0 0);
            --sidebar-foreground: oklch(0.9551 0 0);
            --sidebar-accent: oklch(0.3523 0 0);
            --sidebar-accent-foreground: oklch(1.0000 0 0);
            --sidebar-border: oklch(0.3289 0.0092 268.3843);
            --sidebar-ring: oklch(1.0000 0 0);
            ${
              brand?.primary
                ? `--primary: ${brand.primary}; 
                --sidebar-primary: ${brand.primary}; 
                --sidebar-ring: ${brand.primary}; 
                --ring: ${brand.primary};`
                : ""
            }
            ${
              brand?.primaryForeground
                ? `--primary-foreground: ${brand.primaryForeground};`
                : ""
            }
            ${brand?.secondary ? `--secondary: ${brand.secondary};` : ""}
            ${
              brand?.secondaryForeground
                ? `--secondary-foreground: ${brand.secondaryForeground};`
                : ""
            }
          }
        `}</style>
      </head>
      <body className="bg-background">
        <Providers toastPosition={TOAST_POSITION}>{children}</Providers>
      </body>
    </html>
  );
}
