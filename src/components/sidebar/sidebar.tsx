"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  Clock3,
  Building2,
  Headphones,
  BookOpen,
  Grid2x2,
  CalendarDays,
  ClipboardCheck,
  TimerReset,
  Plane,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

const sidebarItems = [
  {
    title: "Home",
    icon: Home,
    href: "/",
  },

  {
    title: "Time Hub",
    icon: Clock3,
    children: [
      {
        title: "Attendance",
        icon: ClipboardCheck,
        href: "/timehub/attendance",
      },
      {
        title: "Leaves",
        icon: Plane,
        href: "/timehub/leaves",
      },
      {
        title: "Holidays",
        icon: CalendarDays,
        href: "/timehub/holidays",
      },
      {
        title: "Timesheet",
        icon: TimerReset,
        href: "/timehub/timesheet",
      },
    ],
  },

  {
    title: "My Org",
    icon: Building2,
    href: "/my-org",
  },

  {
    title: "Support",
    icon: Headphones,
    href: "/support",
  },

  {
    title: "Learning",
    icon: BookOpen,
    href: "/learning",
  },

  {
    title: "More Apps",
    icon: Grid2x2,
    href: "/apps",
  },
];

export default function WorkifySidebar() {
  const pathname = usePathname();

  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  const toggleMenu = (title: string) => {
    setOpenMenu((prev) => (prev === title ? null : title));
  };

  React.useEffect(() => {
    const activeParent = sidebarItems.find(
      (item) =>
        item.children &&
        item.children.some((child) => pathname.startsWith(child.href)),
    );

    if (activeParent) {
      setOpenMenu(activeParent.title);
    } else {
      setOpenMenu(null);
    }
  }, [pathname]);

  return (
    <Sidebar
      collapsible="icon"
      className="
        border-r border-sidebar-border
        bg-background
        *:data-[sidebar=rail]:hidden
      "
    >
      {/* HEADER */}
      <SidebarHeader
        className="
          px-3 py-3
          group-data-[collapsible=icon]:px-0
        "
      >
        <div
          className="
            flex items-center justify-between
            group-data-[collapsible=icon]:justify-center
          "
        >
          <Image
            src="/logo.png"
            alt="Workify Logo"
            width={140}
            height={40}
            className="
              h-14 w-auto object-contain
              group-data-[collapsible=icon]:hidden
            "
          />

          {/* NORMAL TRIGGER */}
          <SidebarTrigger
            className="
              h-8 w-8 shrink-0
              group-data-[collapsible=icon]:hidden
               bg-transparent hover:bg-transparent
                 shadow-none
            "
          />

          {/* COLLAPSED MINI LOGO */}
          <div
            className="
    relative hidden
    h-10 w-10
    group-data-[collapsible=icon]:flex
    items-center justify-center
    overflow-hidden
    group
  "
          >
            {/* MINI LOGO */}
            <Image
              src="/icon-mini.png"
              alt="Mini Logo"
              width={28}
              height={28}
              className="
      absolute
      transition-all duration-200

      group-hover:opacity-0
      group-hover:scale-75
    "
            />

            {/* SIDEBAR TRIGGER */}
            <SidebarTrigger
              className="
      absolute inset-0

      opacity-0 scale-75
      transition-all duration-200

      group-hover:opacity-100
      group-hover:scale-100

      bg-transparent!
      hover:bg-transparent!
      shadow-none

    "
            />
          </div>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {sidebarItems.map((item) => {
                const isActive = item.children
                  ? item.children.some((child) =>
                      pathname.startsWith(child.href),
                    )
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                const hasChildren = !!item.children;

                // =========================
                // GROUP WITH CHILDREN
                // =========================
                if (hasChildren) {
                  const isOpen = openMenu === item.title;

                  return (
                    <Collapsible key={item.title} open={isOpen}>
                      <SidebarMenuItem>
                        {/* Parent */}
                        <div
                          className={`
                            flex h-11 w-full items-center rounded-md
                            px-2 text-[15px] font-medium
                            transition-colors

                            ${
                              isActive
                                ? "bg-sidebar-accent text-primary"
                                : "text-foreground hover:bg-sidebar-accent/60"
                            }

                            group-data-[collapsible=icon]:justify-center
                            group-data-[collapsible=icon]:px-0
                          `}
                        >
                          {/* Parent Route */}
                          <button
                            type="button"
                            onClick={() => toggleMenu(item.title)}
                            className="
    flex flex-1 items-center gap-2
    overflow-hidden text-left

    group-data-[collapsible=icon]:w-full
    group-data-[collapsible=icon]:justify-center
  "
                          >
                            <item.icon
                              className="
                                h-4 w-4 shrink-0
                                group-data-[collapsible=icon]:mx-auto
                              "
                            />

                            <span className="group-data-[collapsible=icon]:hidden">
                              {item.title}
                            </span>
                          </button>

                          {/* Expand Toggle */}
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              toggleMenu(item.title);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();

                                toggleMenu(item.title);
                              }
                            }}
                            className="
                              flex h-full items-center justify-center
                              px-3 cursor-pointer
                              group-data-[collapsible=icon]:hidden
                            "
                          >
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                        </div>

                        {/* Expanded Menu */}
                        <CollapsibleContent
                          className="
                            mt-1 rounded-md
                            bg-sidebar-accent p-2
                            group-data-[collapsible=icon]:hidden
                          "
                        >
                          <div className="space-y-1">
                            {item.children.map((subItem) => {
                              const isSubActive = pathname === subItem.href;

                              return (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className={`
                                      flex items-center rounded-md
                                      px-3 py-2 text-sm
                                      transition-all

                                      ${
                                        isSubActive
                                          ? "bg-background text-primary font-medium"
                                          : "text-foreground hover:bg-background/60"
                                      }
                                    `}
                                >
                                  {subItem.title}
                                </Link>
                              );
                            })}
                          </div>
                        </CollapsibleContent>

                        {/* Collapsed Icons */}
                        <div
                          className={`
                            hidden
                            mt-2 flex-col items-center gap-2

                            ${
                              isOpen
                                ? "group-data-[collapsible=icon]:flex"
                                : "group-data-[collapsible=icon]:hidden"
                            }
                          `}
                        >
                          {item.children.map((subItem) => {
                            const isSubActive = pathname === subItem.href;

                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={`
                                    flex h-10 w-10 items-center
                                    justify-center rounded-xl
                                    transition-all

                                    ${
                                      isSubActive
                                        ? "bg-sidebar-accent text-primary"
                                        : "text-muted-foreground hover:bg-sidebar-accent/60"
                                    }
                                  `}
                              >
                                <subItem.icon className="h-4 w-4" />
                              </Link>
                            );
                          })}
                        </div>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                // =========================
                // NORMAL MENU
                // =========================
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="
                        group-data-[collapsible=icon]:justify-center
                        group-data-[collapsible=icon]:px-0
                      "
                    >
                      <Link
                        href={item.href}
                        className={`
                          flex h-11 w-full items-center rounded-md
                          px-2 text-[15px] font-medium
                          transition-colors

                          ${
                            isActive
                              ? "bg-sidebar-accent text-primary"
                              : "text-foreground hover:bg-sidebar-accent/60"
                          }

                          group-data-[collapsible=icon]:justify-center
                          group-data-[collapsible=icon]:px-0
                        `}
                      >
                        <item.icon
                          className="
                            h-4 w-4 shrink-0
                            group-data-[collapsible=icon]:mx-auto
                          "
                        />

                        <span className="flex-1 group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
