"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "../ui/sonner";
import { ToasterProps } from "sonner";
import { AuthProvider } from "./auth-provider";
import { Provider as ReduxProvider } from "react-redux";
import store from "@/store/store";

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
      <ReduxProvider store={store}>
        <AuthProvider>
          <Toaster position={toastPosition} expand />

          {children}
        </AuthProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}
