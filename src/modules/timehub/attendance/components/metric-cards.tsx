"use client";

import {
  Clock,
  CalendarDays,
  Timer,
  AlertCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { AttendanceCard } from "./attendance-card";
import GenericBadge from "@/components/common/generic-badge";
import { DonutChart } from "@/components/ui/donut";
const attendanceMetrics = {
  consistency: 92,
  presentDays: 22,
  lateLogins: 3,
  totalDuration: 635400,
  extraDuration: 45900,
  shortDuration: 11700,
  regularizationPending: 2,
};

function TimeValue({
  seconds,
  prefix,
  variant = "default",
}: {
  seconds: number;
  prefix?: string;
  variant?: "default" | "compact";
}) {
  const totalMinutes = Math.floor(seconds / 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  // 🔹 COMPACT (for Extra / Short)
  if (variant === "compact") {
    return (
      <span className="text-sm font-medium">
        {prefix}
        {h}h {m}m
      </span>
    );
  }

  // 🔹 DEFAULT (for big card)
  return (
    <span className="flex items-end gap-1">
      {prefix && <span className="text-xs mr-1">{prefix}</span>}

      <span className="text-xl font-semibold">{h}</span>
      <span className="text-sm text-muted-foreground">h</span>

      <span className="text-xl font-semibold ml-2">{m}</span>
      <span className="text-sm text-muted-foreground">m</span>
    </span>
  );
}

export function AttendanceSummary() {
  return (
    <div className="flex flex-col gap-3">
      {/* TOP ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="border border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to rounded-xl p-4 flex flex-col gap-2">
          <h2 className="text-sm font-medium mb-2">Consistency</h2>

          <div className="flex justify-between items-end">
            <DonutChart value={attendanceMetrics.consistency} />
            <GenericBadge
              label={"Excellent"}
              variant={"pill"}
              className="status-success"
            />
          </div>
        </div>

        <AttendanceCard
          title="Present Days"
          value={attendanceMetrics.presentDays}
          status="success"
          icon={<CalendarDays />}
        />

        <AttendanceCard
          title="Late Logins"
          value={attendanceMetrics.lateLogins}
          status="warning"
          icon={<Clock />}
        />

        <AttendanceCard
          title="Total Worked Hours"
          value={
            <span className="text-2xl font-semibold">
              <TimeValue seconds={attendanceMetrics.totalDuration} />
            </span>
          }
          status="info"
          icon={<Timer />}
        />
      </div>

      {/* SECOND ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <AttendanceCard
          variant="metric"
          title="Extra Hours"
          value={
            <TimeValue
              seconds={attendanceMetrics.extraDuration}
              prefix="+"
              variant="compact"
            />
          }
          valueIcon={<ArrowUp className="w-4 h-4" />}
          status="success"
          icon={<Timer />}
        />

        <AttendanceCard
          variant="metric"
          title="Short Hours"
          value={
            <TimeValue
              seconds={attendanceMetrics.shortDuration}
              prefix="-"
              variant="compact"
            />
          }
          valueIcon={<ArrowDown className="w-4 h-4" />}
          status="danger"
          icon={<Timer />}
        />
        <AttendanceCard
          variant="metric"
          title="Regularization Pending"
          value={`${attendanceMetrics.regularizationPending} entries`}
          status="warning"
          icon={<AlertCircle />}
          rightContent={
            <span className="text-[10px] status-neutral px-2 py-0.5 rounded-full">
              Action needed
            </span>
          }
        />
      </div>
    </div>
  );
}
