"use client";

import { Activity, Briefcase, CalendarCheck, Clock } from "lucide-react";

function getProgress(used: number, total: number) {
  if (!total) return 0;
  return Math.min(Math.round((used / total) * 100), 100);
}

const leaveData = [
  {
    title: "Casual Leave",
    used: 8,
    total: 12,
    icon: Activity,
    color: "#1482DD",
  },
  {
    title: "Sick Leave",
    used: 4,
    total: 12,
    icon: CalendarCheck,
    color: "#10B981",
  },
  {
    title: "Earned Leave",
    used: 15,
    total: 12,
    icon: Briefcase,
    color: "#7C3AED",
  },
  {
    title: "Comp - Off",
    used: 2,
    total: 3,
    icon: Clock,
    color: "#F59E0B",
  },
];

type Variant = "grid" | "stack";

export function LeaveBalanceCard({ variant = "grid" }: { variant?: Variant }) {
  const isGrid = variant === "grid";

  return (
    <div className={`w-full rounded-2xl border ${isGrid ? "p-4" : "p-2"}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Leave Balance</h2>
      </div>

      {/* Layout */}
      <div
        className={`grid ${
          isGrid ? "grid-cols-2 gap-4 py-1" : "grid-cols-1 gap-1"
        }`}
      >
        {leaveData.map((item, i) => {
          const Icon = item.icon;

          return (
            <div
              key={i}
              className={`rounded-xl border bg-white/70 backdrop-blur flex items-center justify-between
                ${isGrid ? "p-4 gap-2" : "p-2 gap-4"}
              `}
            >
              {/* LEFT */}
              <div className={`flex flex-col flex-1 ${isGrid ? "gap-2" : "gap-1"}`}>
                <span className="text-xs text-muted-foreground">
                  {item.title}
                </span>

                <div className={`flex flex-col ${isGrid ? "gap-2" : "gap-1"}`}>
                  <div className={`${isGrid ? "text-lg font-semibold" : "text-sm font-medium"}`}>
                    {item.used}/{item.total}
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-gray-200">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${getProgress(item.used, item.total)}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT ICON */}
              <div
                className={`rounded-full shrink-0 ${
                  isGrid ? "p-2" : "p-1.5"
                }`}
                style={{
                  backgroundColor: `${item.color}1A`,
                }}
              >
                <Icon
                  className={`${isGrid ? "h-6 w-6" : "h-5 w-5"}`}
                  style={{ color: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}