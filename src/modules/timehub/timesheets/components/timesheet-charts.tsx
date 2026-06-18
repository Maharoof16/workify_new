"use client";

import { Clock } from "lucide-react";
import { DonutChart } from "@/components/ui/donut";

type ProjectHour = {
  name: string;
  hours: number;
};

type TimesheetChartsProps = {
  totalHours: number;
  dailyHours: number[]; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
  projectHours: ProjectHour[];
};

export function TimesheetCharts({
  totalHours,
  dailyHours,
  projectHours,
}: TimesheetChartsProps) {
  const target = 40;
  const progressPercentage = Math.min((totalHours / target) * 100, 100);
  const remainingHours = Math.max(target - totalHours, 0);

  // Weekly Summary Days (Mon - Fri, with optional Sat/Sun if entries exist)
  const activeDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  if (dailyHours[5] > 0) activeDays.push("Sat");
  if (dailyHours[6] > 0) activeDays.push("Sun");

  const dayIndexMap: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };

  const maxDailyHour = 12;

  // Hours by Projects (max 4 for the UI layout representation)
  const displayProjects = projectHours.slice(0, 4);
  const maxProjectHour = displayProjects.reduce((max, p) => Math.max(max, p.hours), 0) || 1;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
      {/* Weekly Progress Card */}
      <div className="border border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to rounded-xl p-5 flex flex-col justify-between items-center min-h-[300px]">
        <div className="w-full text-left">
          <h3 className="text-sm font-semibold text-slate-800">Weekly Progress</h3>
        </div>

        <div className="my-auto flex justify-center items-center">
          <DonutChart
            value={progressPercentage}
            size={140}
            strokeWidth={12}
            colors={["#3b82f6", "#e2e8f0"]}
            centerText={
              <div className="text-center">
                <span className="text-2xl font-bold text-slate-800">
                  {totalHours.toFixed(1)}h
                </span>
                <p className="text-[10px] text-slate-400">of {target}h target</p>
              </div>
            }
          />
        </div>

        <div className="w-full flex justify-center">
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-[#1D4ED8]">
            <Clock className="w-4.5 h-4.5" />
            <span>{remainingHours.toFixed(1)}h remaining</span>
          </div>
        </div>
      </div>

      {/* Weekly Summary Card */}
      <div className="border border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to rounded-xl p-5 flex flex-col justify-between min-h-[300px]">
        <h3 className="text-sm font-semibold text-slate-800 mb-2">Weekly Summary</h3>

        <div className="flex flex-1 items-start gap-3 px-2 py-4">
          {/* Y-Axis Grid / Labels */}
          <div className="flex flex-col justify-between h-32 text-[10px] text-slate-400 select-none pt-[2px] w-4 shrink-0">
            <span>{maxDailyHour}</span>
            <span>8</span>
            <span>4</span>
            <span>0</span>
          </div>

          {/* Bar Chart Columns Grid Area */}
          <div className="flex-1 h-32 relative border-b border-slate-200">
            {/* Background Horizontal Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none select-none pb-1 z-0">
              <div className="w-full h-[1px] bg-slate-100" />
              <div className="w-full h-[1px] bg-slate-100" />
              <div className="w-full h-[1px] bg-slate-100" />
              <div className="w-full h-[1px] bg-slate-100" />
            </div>

            {/* Foreground Bars */}
            <div className="absolute inset-0 flex justify-around items-end pb-1 z-10">
              {activeDays.map((day) => {
                const hours = dailyHours[dayIndexMap[day]] || 0;
                const fillPercentage = Math.min((hours / maxDailyHour) * 100, 100);

                return (
                  <div key={day} className="flex flex-col items-center flex-1 h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-1 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                      {hours.toFixed(1)}h
                    </div>

                    {/* The bar track and fill */}
                    <div className="w-6 sm:w-8 h-full flex items-end overflow-hidden">
                      <div
                        style={{ height: `${fillPercentage}%` }}
                        className="w-full bg-[#1D4ED8] rounded-t-[4px] transition-all duration-500"
                      />
                    </div>

                    <span className="text-[10px] text-slate-400 mt-2 font-medium absolute top-full pt-1">
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Total Summary Footer Box */}
        <div className="w-full border border-[#DBEAFE] bg-[#F8FAFC] rounded-lg py-2.5 text-center text-sm font-bold text-[#1D4ED8] mt-2">
          Total: {totalHours.toFixed(1)}h
        </div>
      </div>

      {/* Hours by Projects Card */}
      <div className="border border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to rounded-xl p-5 flex flex-col min-h-[300px]">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Hours by Projects</h3>

        <div className="flex-1 flex flex-col justify-center relative py-2">
          {displayProjects.length === 0 ? (
            <div className="text-center text-xs text-slate-400 my-auto">
              No project hours logged this week
            </div>
          ) : (
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-3 w-full relative">
              {/* Background Grid Lines (Horizontal & Vertical) - aligned with the column 2 bar track area */}
              <div
                className="absolute inset-y-0 right-0 pointer-events-none select-none z-0"
                style={{
                  gridColumn: 2,
                  left: 0,
                }}
              >
                {/* Vertical grid lines */}
                <div className="absolute inset-0 flex justify-between">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div key={idx} className="w-[1px] h-full bg-slate-100/80" />
                  ))}
                </div>
              </div>

              {/* Rows */}
              {displayProjects.map((p, idx) => {
                const widthPercentage = Math.max((p.hours / maxProjectHour) * 100, 5);

                // Progressively lighter blue colors to match the image
                const barColors = [
                  "bg-[#1D4ED8]", // website development (deep blue)
                  "bg-[#3B82F6]", // mobile app (medium blue)
                  "bg-[#60A5FA]", // internal tools (light medium blue)
                  "bg-[#93C5FD]", // client portal (light blue)
                ];
                const barColorClass = barColors[idx % barColors.length];

                return (
                  <div key={p.name} className="contents">
                    {/* Project name label - left-aligned, multiline wrapping enabled without wasted space */}
                    <div className="flex items-center justify-start text-[10px] leading-tight font-semibold text-slate-500 text-left select-none break-words pr-2 max-w-[120px] min-h-[32px] z-10">
                      {p.name}
                    </div>

                    {/* Bar area (acts as the track container) */}
                    <div className="flex-1 h-8 flex items-center relative group z-10">
                      <div
                        style={{ width: `${widthPercentage}%` }}
                        className={`${barColorClass} h-6 rounded-r-[4px] rounded-l-none transition-all duration-500 relative flex items-center`}
                      >
                        {/* Hover Tooltip or Value overlay */}
                        <span className="absolute left-full pl-2 text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {p.hours.toFixed(1)}h
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
