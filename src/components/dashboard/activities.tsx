"use client";

import { CalendarDays, Download, AlertCircle, Check, X } from "lucide-react";
import { CardContent } from "../ui/card";

const activities = [
  {
    title: "Time off is approaching",
    description: "Your casual leave starts on Mar 20 (3 days away).",
    icon: CalendarDays,
    type: "leave",
  },
  {
    title: "Payslip Available",
    description: "February 2026 payslip is ready to download.",
    icon: Download,
    type: "payslip",
  },
  {
    title: "Timesheet Reminder",
    description: "Week 10 timesheet not yet submitted.",
    icon: AlertCircle,
    type: "timesheet",
  },
];

export default function ActivitiesCard() {
  return (
    <div
      className="border border-dashboard-border
  bg-linear-to-b
  from-dashboard-card-from
  to-dashboard-card-to rounded-xl  p-0"
    >
      <CardContent className="px-4 py-5">
        <h3 className="text-base font-semibold py-2">Activities</h3>

        <div className="space-y-3">
          {activities.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-md border border-[#E3ECF5] bg-white p-3"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      item.type === "leave"
                        ? "bg-[#EEF4FF]"
                        : item.type === "payslip"
                          ? "bg-[#E8F8EE]"
                          : "bg-[#FFF0F0]"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        item.type === "leave"
                          ? "text-[#2F6BFF]"
                          : item.type === "payslip"
                            ? "text-[#17B26A]"
                            : "text-[#F04438]"
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="text-[15px] font-semibold text-[#001E4B]">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs text-[#7D8CA1]">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 ">
                  {item.type === "leave" && (
                    <>
                      <button className="cursor-pointer flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl bg-[#EAF8EF] transition hover:scale-105">
                        <Check className="h-3 w-3 md:h-5 md:w-5 text-[#17B26A]" />
                      </button>

                      <button className="cursor-pointer flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl bg-[#FFF1F1] transition hover:scale-105">
                        <X className="h-3 w-3 md:h-5 md:w-5 text-[#F04438]" />
                      </button>
                    </>
                  )}

                  {item.type === "payslip" && (
                    <button className="cursor-pointer flex items-center gap-2 rounded-lg border border-[#D6E4F2] bg-white px-4 py-2 text-xs md:text-sm font-medium text-[#1683E2] transition hover:bg-[#F3F8FF]">
                      <Download className="h-3 w-3 md:h-4 md:w-4" />
                      Download
                    </button>
                  )}

                  {item.type === "timesheet" && (
                    <button className="cursor-pointer rounded-lg bg-[#1683E2] px-5 py-2 text-xs md:text-sm font-medium text-white transition hover:opacity-90">
                      Submit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </div>
  );
}
