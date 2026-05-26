"use client";

import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "./auth-provider";
import { usePermissions } from "./permission-provider";
import { useEntityLabelsStatus } from "./entitylabel-provider";

export function AppInitGate({ children }: { children: React.ReactNode }) {
  const { isLoading: authLoading } = useAuth();
  const { loaded: permissionsLoaded } = usePermissions();

  const labelsLoaded = useEntityLabelsStatus();

  const ready = !authLoading && permissionsLoaded && labelsLoaded;

  if (!ready) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spinner size={48} />
      </div>
    );
  }

  return <>{children}</>;
}
