"use client";

import { BadgeCheck, ChevronRight, Lock } from "lucide-react";

import { useRouter } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { useIsMobile } from "@/hooks/use-mobile";
import React, { useState } from "react";
import { User } from "@/modules/members/users/users";
import { UserAvatar } from "../ui/user-avatar";
import SignOut from "@/modules/auth/components/sign-out";

function UserProfile({ user }: { user: User }) {
  const isMobile = useIsMobile();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible
          open={open}
          onOpenChange={setOpen}
          className="flex flex-col-reverse"
        >
          {/* Trigger Button */}
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`
            flex items-center border
            ${isMobile ? "justify-center" : "justify-start"}
          `}
            >
              <UserAvatar user={user} />

              {!isMobile && (
                <>
                  <div className="grid flex-1 text-left">
                    <span className="truncate text-xs ">Welcome back,</span>

                    <span className="truncate text-md font-semibold">
                      {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
                    </span>
                  </div>

                  <ChevronRight
                    className={`ml-auto size-4 transition-transform duration-200 ${
                      open ? "-rotate-90" : ""
                    }`}
                  />
                </>
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>

          {/* Content Above */}
          <CollapsibleContent
            className="
    mb-2 space-y-1
    rounded-lg 
    bg-background
    p-2 border shadow-sm
  "
          >
            {" "}
            <button
              onClick={() => router.push("/profile/user")}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent"
            >
              <BadgeCheck className="size-4" />
              Account
            </button>
            <button
              onClick={() => router.push("/profile/change-password")}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent"
            >
              <Lock className="size-4" />
              Change Password
            </button>
            <SignOut />
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default React.memo(UserProfile);
