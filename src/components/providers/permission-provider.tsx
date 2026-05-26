  // providers/PermissionProvider.tsx

  "use client";
  import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
  import { AuthService } from "@/modules/auth/auth.service";
  import { useAuth } from "./auth-provider";
import { extractResources, isAdmin } from "@/modules/access-control/permissions/permissions";


  type PermissionState = {
    permissions: string[];
    isAdmin: boolean;
    resources: Set<string>;
    loaded: boolean;
  };

  const PermissionContext = createContext<PermissionState | null>(null);

  export function PermissionProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [permissions, setPermissions] = useState<string[]>([]);
    const [loaded, setLoaded] = useState(false);
    let cachedPermissions: string[] | null = null;
let cachePromise: Promise<string[]> | null = null;


   useEffect(() => {
  if (!isAuthenticated) return;

  let mounted = true;

  async function load() {
    try {
      if (cachedPermissions) {
        setPermissions(cachedPermissions);
        setLoaded(true);
        return;
      }

      if (!cachePromise) {
        cachePromise = AuthService.myPermissions();
      }

      const perms = await cachePromise;

      cachedPermissions = perms;

      if (mounted) {
        setPermissions(perms);
        setLoaded(true);
      }
    } catch {
      if (mounted) setLoaded(true);
    }
  }

  load();

  return () => {
    mounted = false;
  };
}, [isAuthenticated]);


    const value = useMemo(() => ({
      permissions,
      isAdmin: isAdmin(permissions),
      resources: extractResources(permissions),
      loaded,
    }), [permissions, loaded]);

    return (
      <PermissionContext.Provider value={value}>
        {children}
      </PermissionContext.Provider>
    );
  }

  export function usePermissions() {
    const ctx = useContext(PermissionContext);

    if (!ctx) {
      return {
        permissions: [],
        isAdmin: false,
        resources: new Set<string>(),
        loaded: false,
      };
    }

    return ctx;
  }

