"use client";


import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/components/providers/auth-provider";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function UnAuthorizedLayout({ children }: AuthLayoutProps) {

  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/home");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || (!isLoading && isAuthenticated)) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spinner size={48} />
      </div>
    );
  }
  return (
    <div>
        {children}
    </div>
  );
}
