"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Provider as ReduxProvider } from "react-redux";
import store from "@/store/store";
import { AuthProvider, useAuth } from "@/components/providers/auth-provider";
import { EntityLabelProvider } from "./entitylabel-provider";
import { usePathname } from "next/navigation";
import { PermissionProvider } from "./permission-provider";
import { AppInitGate } from "./app-init-gate";
import { Toaster } from "../ui/sonner";
import { ToasterProps } from "sonner";


function AppProviders({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return children;
  return (
    <PermissionProvider>
      <EntityLabelProvider>
        <AppInitGate>{children}</AppInitGate>
      </EntityLabelProvider>
    </PermissionProvider>
  );
}

export default function Providers({
  children,
  toastPosition,
}: {
  children: React.ReactNode;
  toastPosition: ToasterProps["position"];
}) {
  const pathname = usePathname();
  // const isAuthRoute = pathname.startsWith("/auth");
  const isPublicRoute =
    pathname === "/" || pathname.startsWith("/auth");
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReduxProvider store={store}>
        <AuthProvider>
          <QueryProvider>
            <Toaster position={toastPosition} expand />

            {isPublicRoute ? children :
              <AppProviders>
                {children}
              </AppProviders>}
          </QueryProvider>
        </AuthProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}
