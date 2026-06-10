"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { Bell, Mail, Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { SidebarTrigger } from "../ui/sidebar";
import logoDark from "@/assets/dark.png";
import logoLight from "@/assets/logo.png";
import { useEffect, useState } from "react";

export default function Header() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  

  useEffect(() => {
    setMounted(true);
  }, []);

  const logo = resolvedTheme === "dark" ? logoDark : logoLight;

  return (
    <header className="h-14 border-b bg-background px-4">
      <div className="flex h-full items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>

          <button className="hidden md:flex h-8 w-8 items-center justify-center rounded-sm transition-colors hover:bg-accent/40">
            <Bell className="h-4.25 w-4.25" />
          </button>

          <button className="hidden md:flex h-8 w-8 items-center justify-center rounded-sm transition-colors hover:bg-accent/40">
            <Mail className="h-4.25 w-4.25" />
          </button>
        </div>

        <div className="hidden md:flex flex-1 justify-center px-6">
          <div
            className="
              flex h-10 w-full max-w-md items-center gap-2
              rounded-sm border border-input
              bg-muted/20 px-3             
            "
          >
            <Search className="h-4.25 w-4.25 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search anything..."
              className="
                h-full w-full bg-transparent text-[15px]
                outline-none placeholder:text-muted-foreground
              "
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

            {mounted && (
            <Image src={logo} alt="Logo" className="h-6 w-auto" priority />
          )}
        </div>
      </div>
    </header>
  );
}
