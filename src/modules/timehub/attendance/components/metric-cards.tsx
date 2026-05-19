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


type AttendanceMetricsType = {
  consistency: number;
  presentDays: number;
  lateLogins: number;
  totalDuration: number;
  extraDuration: number;
  shortDuration: number;
  regularizationPending: number;
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
  if (variant === "compact") {
    return (
      <span className="text-sm font-semibold">
        {prefix}
        {h}h {m}m
      </span>
    );
  }
  return (
    <span className="flex items-end gap-4">
      {prefix && <span className="text-xs">{prefix}</span>}

      <div>
        <span className="text-xl font-bold">{h}</span>
        <span className="text-sm">h</span>
      </div>

      <div>
        <span className="text-xl font-bold">{m}</span>
        <span className="text-sm">m</span>
      </div>
    </span>
  );
}

export function AttendanceSummary({
  metrics,
}: {
  metrics: AttendanceMetricsType | null;
}) {
  if (!metrics) return null;
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="border border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to rounded-xl p-4 flex flex-col gap-5">
          <h2 className="text-[16px] font-medium">Consistency</h2>

          <div className="flex justify-between items-end">
            <DonutChart value={metrics.consistency} />
            <GenericBadge
              label={"Excellent"}
              variant={"pill"}
              className="status-success"
            />
          </div>
        </div>

        <AttendanceCard
          title="Present Days"
          value={metrics.presentDays}
          status="success"
          icon={<CalendarDays />}
        />

        <AttendanceCard
          title="Late Logins"
          value={metrics.lateLogins}
          status="warning"
          icon={<Clock />}
        />

        <AttendanceCard
          title="Total Worked Hours"
          value={
            <span className="text-2xl font-bold">
              <TimeValue seconds={metrics.totalDuration} />
            </span>
          }
          status="info"
          icon={<Timer />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AttendanceCard
          variant="metric"
          title="Extra Hours"
          value={
            <TimeValue
              seconds={metrics.extraDuration}
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
             seconds={metrics.shortDuration}
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
           value={`${metrics.regularizationPending} entries`}
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
