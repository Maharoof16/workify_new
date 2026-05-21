"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "../ui/sonner";
import { ToasterProps } from "sonner";

export default function Providers({
  children,
  toastPosition,
}: {
  children: React.ReactNode;
  toastPosition: ToasterProps["position"];
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster position={toastPosition} expand />

      {children}
    </ThemeProvider>
  );
}
