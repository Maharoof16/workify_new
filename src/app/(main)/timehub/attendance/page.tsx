"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarIcon, MoveLeft, MoveRight } from "lucide-react";
import {
  addMonths,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useRouter } from "next/navigation";
import { buildColumns } from "@/lib/table-utils";
import { AttendanceSummary } from "@/modules/timehub/attendance/components/metric-cards";
import {
  AttendanceMetrics,
  DailyLog,
  LogStatus,
} from "@/modules/timehub/attendance/attendance";
import { AttendanceService } from "@/modules/timehub/attendance/attendance.service";
import { Skeleton } from "@/components/ui/skeleton";

const StatusBadge = ({ status }: { status: LogStatus }) => {
  const map = {
    PRESENT: "status-success",
    LATE: "status-warning",
    ABSENT: "status-danger",
  };

  const labelMap = {
    PRESENT: "Present",
    LATE: "Late",
    ABSENT: "Absent",
  };

  return (
    <Badge
      variant="outline"
      className={`rounded-full px-3 border-none ${map[status]}`}
    >
      {labelMap[status]}
    </Badge>
  );
};

function formatTime(utc?: string) {
  if (!utc) return "-";
  return format(new Date(utc), "hh:mm a");
}

function formatDuration(seconds?: number) {
  if (!seconds) return "-";

  const totalMinutes = Math.floor(seconds / 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  return `${h}h ${m}m`;
}

export default function AttendancePage() {
  const router = useRouter();

  const abortControllerRef = useRef<AbortController | null>(null);

  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [metrics, setMetrics] = useState<AttendanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const startDate = startOfMonth(currentMonth);
    const endDate = endOfMonth(currentMonth);

    const periodStart = format(startDate, "yyyy-MM-dd");
    const periodEnd = format(endDate, "yyyy-MM-dd");

    fetchAttendance(periodStart, periodEnd, pagination.page, pagination.limit);
  }, [currentMonth, pagination.page, pagination.limit]);

  const fetchAttendance = async (
    start: string,
    end: string,
    page: number,
    limit: number,
  ) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);

    try {
      const res = await AttendanceService.getAll(
        start,
        end,
        page,
        limit,
        controller.signal,
      );

      setLogs(res.data.attendance);
      setMetrics(res.data.attendanceMetrics);

      setPagination((prev) => ({
        ...prev,
        total: res.pagination.total,
        totalPages: res.pagination.totalPages,
      }));
    } catch (error: any) {
      if (error.code === "ERR_CANCELED") return;

      console.error("Failed to fetch attendance:", error);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const columns = useMemo(() => {
    return buildColumns<DailyLog>({
      headers: [
        "Date",
        "Day",
        "Punch In",
        "Punch Out",
        "Break",
        "Total Hours",
        "Status",
        "Action",
      ],
      customRenderers: {
        Date: {
          cell: (item) => (
            <span className="text-sm font-medium">
              {format(new Date(item.date), "MMM d, yyyy")}
            </span>
          ),
        },

        Day: {
          cell: (item) => format(new Date(item.date), "EEE"),
        },

        "Punch In": {
          cell: (item) => formatTime(item.punchIn),
        },

        "Punch Out": {
          cell: (item) => formatTime(item.punchOut),
        },

        Break: {
          cell: (item) => formatDuration(item.breakDuration),
        },

        "Total Hours": {
          cell: (item) => (
            <span className="font-medium">
              {formatDuration(item.workedDuration)}
            </span>
          ),
        },

        Status: {
          cell: (item) => <StatusBadge status={item.status} />,
        },

        Action: {
          cell: (item) => {
            if (item.status === "ABSENT" || item.status === "LATE") {
              return (
                <Badge
                  onClick={() => router.push("attendance/regularize")}
                  className="cursor-pointer status-info group flex items-center gap-1"
                >
                  <span>Regularise</span>

                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Badge>
              );
            }

            return <span className="text-muted-foreground">-</span>;
          },
        },
      },
    });
  }, []);

  function AttendanceSummarySkeleton() {
    return (
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="border border-dashboard-border rounded-xl p-4 flex flex-col gap-5">
            <Skeleton className="h-4 w-24" />

            <div className="flex justify-between items-end">
              <Skeleton className="h-28 w-28 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>

          <div className="border rounded-xl p-4 flex flex-col gap-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-16" />
          </div>

          <div className="border rounded-xl p-4 flex flex-col gap-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-16" />
          </div>

          <div className="border rounded-xl p-4 flex flex-col gap-3">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="border rounded-xl p-4 flex flex-col gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>

          <div className="border rounded-xl p-4 flex flex-col gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>

          <div className="border rounded-xl p-4 flex flex-col gap-3">
            <Skeleton className="h-4 w-36" />
            <div className="flex gap-3 items-center">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:justify-between">
        <h1 className="text-xl font-bold sm:text-2xl">Attendance</h1>

        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-sm"
            onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
          >
            <MoveLeft className="h-4 w-4" />
          </Button>

          <span className="w-24 sm:w-28 text-center text-xs sm:text-sm font-medium">
            {format(currentMonth, "MMMM yyyy")}
          </span>

          <Button
            variant="outline"
            size="sm"
            className="rounded-sm"
            onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
            disabled={endOfMonth(currentMonth) > new Date()}
          >
            <MoveRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        {loading ? (
          <AttendanceSummarySkeleton />
        ) : (
          <AttendanceSummary metrics={metrics} />
        )}
      </div>

      <div className="rounded-xl bg-card overflow-x-auto">
        <div
          className=" space-y-3 border border-dashboard-border
          bg-linear-to-b
          from-dashboard-card-from
          to-dashboard-card-to rounded-xl  p-4"
        >
          <div className="flex justify-between">
            <h2 className="text-[18px] font-semibold">Daily Logs</h2>
            <button className="text-sm text-primary hover:underline">
              Download Report
            </button>
          </div>

          <DataTable
            name="leaveTable"
            data={logs}
            columns={columns}
            loading={loading}
            visibilityToggle={false}
          />
        </div>
      </div>
    </div>
  );
}
