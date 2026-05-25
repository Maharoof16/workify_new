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
  Building,
  Cpu,
  MapPin,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    href: "/home",
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
     children: [
      {
        title: "Department's",
        icon: Building,
        href: "/org/department",
      },
      {
        title: "Location's",
        icon: MapPin,
        href: "/org/location",
      },
      {
        title: "Metadata",
        icon: Cpu,
        href: "/org//meta-fields",
      },
    ],
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

export default function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  React.useEffect(() => {
    const el = document.querySelector("[data-collapsible]");

    if (!el) return;

    const update = () => {
      setCollapsed(el.getAttribute("data-collapsible") === "icon");
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const toggleMenu = (title: string) => {
    setOpenMenu((prev) => (prev === title ? null : title));
  };

  const isActive = (item: any) =>
    item.children
      ? item.children.some((c: any) => pathname.startsWith(c.href))
      : pathname.startsWith(item.href);

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

  const maybeTooltip = (title: string, children: React.ReactNode) => {
    if (!collapsed) return children;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="right">{title}</TooltipContent>
      </Tooltip>
    );
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar
        collapsible="icon"
        className="
        border-r border-sidebar-border
        bg-background
        *:data-[sidebar=rail]:hidden
      "
      >
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
              priority
              unoptimized
              src="/logo.png"
              alt="Workify Logo"
              width={140}
              height={40}
              className="
              h-14 w-auto object-contain
              group-data-[collapsible=icon]:hidden
            "
            />
            <SidebarTrigger
              className="
              hidden md:flex

              h-8 w-8 shrink-0
              group-data-[collapsible=icon]:hidden

              bg-transparent
              hover:bg-transparent
              shadow-none
            "
            />
            <div
              className="
            relative
            hidden

            md:group-data-[collapsible=icon]:flex

            h-10 w-10 shrink-0
            items-center justify-center
            overflow-hidden
            group/logo
          "
            >
              <Image
                priority
                unoptimized
                src="/icon-mini.png"
                alt="Mini Logo"
                width={28}
                height={28}
                className="
                absolute
                transition-all duration-200

                group-hover/logo:opacity-0
                group-hover/logo:scale-75
              "
              />

              {/* SIDEBAR TRIGGER */}
              <SidebarTrigger
                className="
              hidden md:flex

              absolute left-1/2 top-1/2
              -translate-x-1/2 -translate-y-1/2

              h-8 w-8 min-w-8 p-0

              items-center justify-center

              opacity-0 scale-75
              transition-all duration-200

              group-hover/logo:opacity-100
              group-hover/logo:scale-100

              bg-transparent!
              hover:bg-transparent!
              shadow-none
            "
              />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {sidebarItems.map((item) => {
                  const hasChildren = !!item.children;

                  const isActive = hasChildren
                    ? item.children!.some((child) =>
                        pathname.startsWith(child.href),
                      )
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                  const isOpen = openMenu === item.title;

                  if (!hasChildren) {
                    const link = (
                      <Link
                        href={item.href}
                        className={`
                        flex h-11 items-center gap-2 rounded-sm px-2 transition-colors
                        ${
                          isActive
                            ? "bg-sidebar-accent text-primary"
                            : "text-foreground hover:bg-sidebar-accent/60"
                        }

                        group-data-[collapsible=icon]:mx-auto
                        group-data-[collapsible=icon]:w-9
                        group-data-[collapsible=icon]:h-9
                        group-data-[collapsible=icon]:rounded-full
                        group-data-[collapsible=icon]:justify-center
                        group-data-[collapsible=icon]:px-0
                      `}
                      >
                        <item.icon className="h-4 w-4" />

                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </Link>
                    );
                    return (
                      <SidebarMenuItem key={item.title}>
                        {maybeTooltip(item.title, link)}
                      </SidebarMenuItem>
                    );
                  }

                  return (
                    <Collapsible key={item.title} open={isOpen}>
                      <SidebarMenuItem>
                        {/* Parent */}
                        <div
                          className={`
                          flex h-11 items-center rounded-sm px-2 transition-colors
                          ${
                            isActive
                              ? "bg-sidebar-accent text-primary group-data-[collapsible=icon]:rounded-full"
                              : "text-foreground hover:bg-sidebar-accent/60"
                          }

                          group-data-[collapsible=icon]:mx-auto
                          group-data-[collapsible=icon]:w-9
                          group-data-[collapsible=icon]:h-9
                          group-data-[collapsible=icon]:rounded-full
                          group-data-[collapsible=icon]:justify-center
                          group-data-[collapsible=icon]:px-0
                        `}
                        >
                          <button
                            type="button"
                            onClick={() => toggleMenu(item.title)}
                            className="
                            flex flex-1 items-center gap-2
                            overflow-hidden
                            group-data-[collapsible=icon]:justify-center
                          "
                          >
                            <item.icon className="h-4 w-4 shrink-0" />

                            <span className="group-data-[collapsible=icon]:hidden">
                              {item.title}
                            </span>
                          </button>

                          {/* toggle */}
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
                            mt-1 rounded-md bg-sidebar-accent p-2
                            group-data-[collapsible=icon]:hidden
                          "
                        >
                          <div className="space-y-1">
                            {item.children.map((sub) => {
                              const subActive = pathname === sub.href;

                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  className={`
                                  flex items-center rounded-sm px-3 py-2 text-sm
                                  transition-colors

                                  ${
                                    subActive
                                      ? "bg-background text-primary font-medium"
                                      : "text-foreground hover:bg-background/60"
                                  }
                                `}
                                >
                                  {sub.title}
                                </Link>
                              );
                            })}
                          </div>
                        </CollapsibleContent>

                        {/* Collapsed Icons */}
                        <div className="hidden group-data-[collapsible=icon]:grid grid-cols-1 gap-2 mt-2">
                          {item.children.map((sub) => {
                            const subActive = pathname === sub.href;

                            const icon = (
                              <Link
                                href={sub.href}
                                className={`
                    flex h-9 w-9 items-center justify-center rounded-full
                    transition-colors

                    ${
                      subActive
                        ? "bg-sidebar-accent text-primary"
                        : "text-muted-foreground hover:bg-sidebar-accent/60"
                    }
                  `}
                              >
                                <sub.icon className="h-4 w-4" />
                              </Link>
                            );

                            return (
                              <div key={sub.href}>
                                {maybeTooltip(sub.title, icon)}
                              </div>
                            );
                          })}
                        </div>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
}
