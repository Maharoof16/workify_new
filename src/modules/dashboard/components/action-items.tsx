"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import calendarImg from "@/assets/Calendar.png";
import TimeSheet from "@/assets/Timesheet.png";
import RaiseTicket from "@/assets/RaiseTicket.png";
import Projects from "@/assets/projects.png";
import NewRequest from "@/assets/newRequest.png";

import { Card, CardContent } from "@/components/ui/card";

const actions = [
  {
    title: "Apply Leave",
    subtitle: "Request Time Off",
    image: calendarImg,
  },
  {
    title: "Time sheets",
    subtitle: "Update Timesheets",
    image: TimeSheet,
  },
  {
    title: "Raise Ticket",
    subtitle: "Get Support",
    image: RaiseTicket,
  },
  {
    title: "Projects",
    subtitle: "See all the projects",
    image: Projects,
  },
  {
    title: "New Request",
    subtitle: "Submit HR Request",
    image: NewRequest,
  },
];

export function ActionItemsCard() {
  return (
    <div
      className="border border-dashboard-border
  bg-linear-to-b
  from-dashboard-card-from
  to-dashboard-card-to rounded-xl  p-0"
    >
      <CardContent className="p-4 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-[#001E4B]">
          My Action Items
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:flex gap-3">
          {actions.map((item, i) => (
            <Card
              key={i}
              className="flex-1 border border-white/60 bg-white/80 rounded-md"
            >
              <CardContent className="flex flex-col gap-3 items-center justify-center text-center p-2">
                <div>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#1e293b]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{item.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="hidden lg:flex w-12 border border-white/60 bg-white/80 backdrop-blur-md shadow-[0_4px_14px_rgba(0,0,0,0.06)] rounded-2xl">
            <CardContent className="flex h-full items-center justify-center p-0 cursor-pointer hover:bg-white transition-all">
              <ChevronRight className="h-5 w-5 text-slate-500" />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </div>
  );
}
