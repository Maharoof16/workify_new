"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import securityImg from "@/assets/security-policy.png";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { TimesheetService } from "../timesheet.service";
import { Skeleton } from "@/components/ui/skeleton";

export function TimesheetFormLayout({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentWeek = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const weekStart = startOfWeek(today, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
        const startStr = format(weekStart, "yyyy-MM-dd");
        const endStr = format(weekEnd, "yyyy-MM-dd");
        
        const res = await TimesheetService.getbyperiod(startStr, endStr);
        if (res?.data?.timeEntries) {
          setEntries(res.data.timeEntries);
        }
      } catch (err) {
        console.error("Failed to fetch current week timesheet in layout", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentWeek();
  }, []);

  const getLocalDateString = (d: Date = new Date()) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dStr = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dStr}`;
  };

  const todayStr = getLocalDateString();
  const todayEntries = entries.filter((entry) => {
    if (!entry.entryDate) return false;
    return entry.entryDate.split("T")[0] === todayStr;
  });

  const todayMins = todayEntries.reduce((acc, entry) => acc + (entry.totalMinutes || 0), 0);
  const todayHoursDecimal = Number((todayMins / 60).toFixed(1));

  const sortedTodayEntries = [...todayEntries].sort((a, b) => {
    const startA = a.startAt ? new Date(a.startAt).getTime() : 0;
    const startB = b.startAt ? new Date(b.startAt).getTime() : 0;
    return startA - startB;
  });

  const totalMins = entries.reduce((acc, entry) => acc + (entry.totalMinutes || 0), 0);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const currentWeekDay = dayOfWeek === 0 ? 7 : dayOfWeek;
  const daysCompleted = Math.min(5, Math.max(1, currentWeekDay));

  const weekAvg = Number((totalMins / 60 / daysCompleted).toFixed(1));

  const dailyMinutesMap: Record<string, number> = {};
  entries.forEach((entry) => {
    if (entry.entryDate) {
      const dateKey = entry.entryDate.split("T")[0];
      dailyMinutesMap[dateKey] = (dailyMinutesMap[dateKey] || 0) + (entry.totalMinutes || 0);
    }
  });

  let totalOvertimeMins = 0;
  Object.values(dailyMinutesMap).forEach((mins) => {
    if (mins > 8 * 60) {
      totalOvertimeMins += (mins - 8 * 60);
    }
  });

  const overtime = Number((totalOvertimeMins / 60).toFixed(1));

  return (
    <div className="max-w-7xl mx-auto px-0 py-0">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 items-start">
        <div className="lg:col-span-7 flex flex-col gap-0">
          <div
            className="rounded-md border border-[#D9E7F2] overflow-hidden"
            style={{
              background: "linear-gradient(to bottom, #F6FAFE, #FFFFFF)",
            }}
          >
            {children}
          </div>
        </div>

        {/* Right Column - Side Widgets */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#F2F9FF] rounded-lg p-5">
            <div className="flex justify-between items-center">
              <span
                className="text-[13px] font-semibold"
                style={{ color: "#464555" }}
              >
                Today's Progress
              </span>
              <div className="flex items-baseline">
                {loading ? (
                  <Skeleton className="h-7 w-12 bg-blue-200/50" />
                ) : (
                  <span className="text-[28px] font-extrabold text-[#1a73e8] leading-none">
                    {todayHoursDecimal}
                  </span>
                )}
                <span className="text-xs font-semibold text-[#1a73e8] ml-1">
                  /8.0hrs
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#F2F9FF] rounded-lg p-5 space-y-5">
            <h3 className="text-[13px] font-semibold" style={{ color: "#464555" }}>
              Today's Timeline
            </h3>
            <div className="space-y-5">
              {loading ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-3 h-3 rounded-full bg-slate-200 mt-1 shrink-0" />
                    <div className="space-y-1 w-full">
                      <Skeleton className="h-3 w-16 bg-slate-200" />
                      <Skeleton className="h-3.5 w-3/4 bg-slate-200" />
                      <Skeleton className="h-3 w-1/2 bg-slate-200" />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-3 h-3 rounded-full bg-slate-200 mt-1 shrink-0" />
                    <div className="space-y-1 w-full">
                      <Skeleton className="h-3 w-16 bg-slate-200" />
                      <Skeleton className="h-3.5 w-1/2 bg-slate-200" />
                    </div>
                  </div>
                </div>
              ) : sortedTodayEntries.length === 0 ? (
                <div className="text-[11px] text-slate-500 font-medium py-1">
                  No entries logged for today yet.
                </div>
              ) : (
                sortedTodayEntries.map((entry, idx) => {
                  const startTime = entry.startAt ? format(new Date(entry.startAt), "HH:mm") : "";
                  const endTime = entry.endAt ? format(new Date(entry.endAt), "HH:mm") : "";
                  const timeRange = startTime && endTime ? `${startTime} – ${endTime}` : `${entry.totalMinutes || 0}m`;
                  const taskTitle = entry.task?.title || entry.description || "Work Entry";
                  const projectName = entry.project?.name || "No Project";
                  
                  const dotColor = idx === 0 ? "bg-[#1a73e8]" : "bg-[#cbd5e1]";
                  const textColor = idx === 0 ? "text-[#1a73e8]" : "text-[#464555]";
                  const titleWeight = idx === 0 ? "font-bold" : "font-medium";

                  return (
                    <div key={entry.id || idx} className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full ${dotColor} shrink-0 mt-1`} />
                      <div className="space-y-0.5">
                        <div className={`text-[11px] font-semibold ${textColor}`}>
                          {timeRange}
                        </div>
                        <h4
                          className={`text-[13px] leading-tight ${titleWeight}`}
                          style={{ color: "#1B1B24" }}
                        >
                          {taskTitle}
                        </h4>
                        <p className="text-[11px]" style={{ color: "#464555" }}>
                          {projectName}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-[#F2F9FF] rounded-lg p-5 relative overflow-hidden space-y-3">
            <div
              className="absolute right-2 bottom-1 pointer-events-none opacity-90"
              style={{ mixBlendMode: "multiply" }}
            >
              <Image
                src={securityImg}
                alt="Security Policy"
                width={84}
                height={84}
                className="w-16 h-16 object-contain"
                style={{ filter: "brightness(0) saturate(100%) invert(42%) sepia(87%) saturate(2250%) hue-rotate(195deg) brightness(95%) contrast(92%)" }}
              />
            </div>
            <h3 className="text-[13px] font-bold" style={{ color: "#001E4B" }}>
              Studio Policy Reminder
            </h3>
            <p className="text-[11px] leading-relaxed" style={{ color: "#001E4B" }}>
              Timesheets must be finalized by 6:00 PM every Friday. Ensure all
              billable entries include a detailed task description for client
              invoicing transparency.
            </p>
            <div className="h-px bg-[#D9E7F2] w-[73%]" />
            <div className="flex items-center gap-2">
              <ShieldCheck
                className="w-3.5 h-3.5 shrink-0"
                style={{ color: "#001E4B" }}
              />
              <span
                className="text-[10px] font-bold tracking-tight uppercase"
                style={{ color: "#001E4B" }}
              >
                DCAA Compliant System
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            <div className="bg-[#F2F9FF] rounded-lg p-3 sm:p-4 xl:pl-4 xl:pr-14 xl:py-4 flex items-center justify-between gap-1.5 sm:gap-2">
              <span
                className="text-[11px] sm:text-[13px] font-semibold truncate shrink-0"
                style={{ color: "#1B1B24" }}
              >
                Week Avg
              </span>
              {loading ? (
                <Skeleton className="h-5 w-8 sm:h-6 sm:w-10 bg-blue-200/50 shrink-0" />
              ) : (
                <p className="text-base sm:text-xl font-extrabold text-[#1a73e8] shrink-0">{weekAvg}h</p>
              )}
            </div>
            <div className="bg-[#F2F9FF] rounded-lg p-3 sm:p-4 xl:pl-4 xl:pr-14 xl:py-4 flex items-center justify-between gap-1.5 sm:gap-2">
              <span
                className="text-[11px] sm:text-[13px] font-semibold truncate shrink-0"
                style={{ color: "#1B1B24" }}
              >
                Overtime
              </span>
              {loading ? (
                <Skeleton className="h-5 w-8 sm:h-6 sm:w-10 bg-blue-200/50 shrink-0" />
              ) : (
                <p className="text-base sm:text-xl font-extrabold text-[#1a73e8] shrink-0">{overtime}h</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
