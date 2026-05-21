"use client";


import { ThemeToggle } from "./theme-toggle";
import { SidebarTrigger } from "../ui/sidebar";

export default function Header() {
  // const isMobile = useIsMobile();


  return (
    <header className="h-14 px-4 flex items-center justify-between border-b bg-background">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
        <ThemeToggle />
    </header>
  );
}
