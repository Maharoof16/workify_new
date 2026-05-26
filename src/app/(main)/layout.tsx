"use client";

import { ReactNode, useEffect } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Header from "@/components/header/header";
import AppSidebar from "@/components/sidebar/app-sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

type Props = {
  children: ReactNode;
};

// export default function MainLayout({ children }: Props) {
//   return (
//     <SidebarProvider className="min-h-screen flex">
//       <AppSidebar />
//       <SidebarInset className="flex-1 flex flex-col overflow-x-hidden">
//         <main className="flex-1 flex flex-col overflow-hidden">
//             <header className="sticky top-0 z-50">
//                 <Header />
//             </header>
//              {/* <header className="flex h-14 items-center border-b px-4 md:hidden">
//                   <SidebarTrigger />
//                 </header> */}
//           <section className="flex-1 w-full overflow-hidden p-4 md:p-6 pb-20 md:pb-0">
//             {children}
//           </section>
//         </main>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

export default function MainLayout({ children }: Props) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spinner size={48} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }
  return (
    <SidebarProvider className="min-h-svh flex">
      <AppSidebar />
      <SidebarInset className="flex flex-col h-svh overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
