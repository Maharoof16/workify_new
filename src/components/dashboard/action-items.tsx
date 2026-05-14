"use client";

import {
  Calendar,
  FileText,
  HelpCircle,
  Briefcase,
  Plus,
  ChevronRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const actions = [
  {
    title: "Apply Leave",
    subtitle: "Request Time Off",
    icon: Calendar,
    color: "text-green-500",
    bg: "bg-green-100",
  },
  {
    title: "Time sheets",
    subtitle: "Update Timesheets",
    icon: FileText,
    color: "text-purple-500",
    bg: "bg-purple-100",
  },
  {
    title: "Raise Ticket",
    subtitle: "Get Support",
    icon: HelpCircle,
    color: "text-yellow-500",
    bg: "bg-yellow-100",
  },
  {
    title: "Projects",
    subtitle: "See all the projects",
    icon: Briefcase,
    color: "text-red-500",
    bg: "bg-red-100",
  },
  {
    title: "New Request",
    subtitle: "Submit HR Request",
    icon: Plus,
    color: "text-blue-500",
    bg: "bg-blue-100",
  },
];

export function ActionItemsCard() {
  return (
    <Card className="bg-[#f1f5f9] shadow-sm p-0">
      <CardContent className="p-4">
        {/* Header */}
        <h2 className="mb-2 text-lg font-semibold text-[#1e3a5f]">
          My Action Items
        </h2>

        {/* Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-stretch gap-3">
          {actions.map((item, i) => {
            const Icon = item.icon;

            return (
              <Card key={i} className="flex border shadow-sm">
                <CardContent className="flex h-full flex-col items-center justify-center text-center">
                  {/* Icon */}
                  <div
                    className={`mb-2 flex h-6 w-6 items-center justify-center rounded-lg ${item.bg}`}
                  >
                    <Icon className={`h-8 w-8 ${item.color}`} />
                  </div>

                  {/* Text */}
                  <p className="text-xs font-medium text-gray-800">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">{item.subtitle}</p>
                </CardContent>
              </Card>
            );
          })}

          {/* Chevron */}
          <Card className="hidden lg:flex w-10 items-stretch shadow-sm">
            <CardContent className="flex h-full items-center justify-center p-0 cursor-pointer hover:bg-gray-50 transition">
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
