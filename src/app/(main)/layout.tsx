"use client";

import { ReactNode, useEffect } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Header from "@/components/header/header";
import AppSidebar from "@/components/sidebar/app-sidebar";


type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <SidebarProvider className="min-h-screen flex">
      <AppSidebar />
      <SidebarInset className="flex-1 flex flex-col overflow-x-hidden">
        <main className="flex-1 flex flex-col overflow-hidden">
            <header className="sticky top-0 z-50">
                <Header />
            </header>
             {/* <header className="flex h-14 items-center border-b px-4 md:hidden">
                  <SidebarTrigger />
                </header> */}
          <section className="flex-1 w-full overflow-hidden p-4 md:p-6 pb-20 md:pb-0">
            {children}
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
