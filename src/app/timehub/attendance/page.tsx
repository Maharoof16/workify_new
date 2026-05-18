"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { addDays, format, startOfWeek } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import { buildColumns } from "@/lib/table-utils";
import { AttendanceSummary } from "@/modules/timehub/attendance/components/metric-cards";

type LogStatus = "PRESENT" | "LATE" | "ABSENT";

type DailyLog = {
  id: string;
  date: string; // ISO date

  punchIn?: string; // UTC ISO
  punchOut?: string; // UTC ISO

  breakDuration?: number; // seconds
  workedDuration?: number; // seconds

  status: LogStatus;
};

const logsData: DailyLog[] = [
  {
    id: "1",
    date: "2024-05-15",
    punchIn: "2024-05-15T03:30:00Z", // 09:00 AM IST
    punchOut: "2024-05-15T12:30:00Z", // 06:00 PM IST
    breakDuration: 3600,
    workedDuration: 28800,
    status: "PRESENT",
  },
  {
    id: "2",
    date: "2024-05-14",
    punchIn: "2024-05-14T03:45:00Z",
    punchOut: "2024-05-14T13:00:00Z",
    breakDuration: 3600,
    workedDuration: 29700,
    status: "LATE",
  },
  {
    id: "3",
    date: "2024-05-13",
    punchIn: "2024-05-13T03:25:00Z",
    punchOut: "2024-05-13T12:30:00Z",
    breakDuration: 3600,
    workedDuration: 29100,
    status: "PRESENT",
  },
  {
    id: "4",
    date: "2024-05-10",
    status: "ABSENT",
  },
];

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
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
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
                  className="cursor-pointer status-info"
                  onClick={() => router.push("attendance/regularize")}
                >
                  Regularise →
                </Badge>
              );
            }
            return <span className="text-muted-foreground">-</span>;
          },
        },
      },
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="font-jakarta-bold ">Attendance</h1>
        <div className="pr-10">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs md:text-sm font-medium">
                  {format(weekDays[0], "MMM d")} –{" "}
                  {format(weekDays[6], "MMM d, yyyy")}
                </span>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={currentWeek}
                month={currentWeek}
                onMonthChange={(month) => setCurrentWeek(month)}
                onSelect={(date) => {
                  if (!date) return;
                  const start = startOfWeek(date, { weekStartsOn: 1 });
                  setCurrentWeek(start);
                  setCalendarOpen(false);
                }}
                disabled={(date) => date > new Date()}
                modifiers={{
                  selected: (date) =>
                    date >= weekDays[0] && date <= weekDays[6],
                }}
                modifiersClassNames={{
                  selected: "bg-primary text-white",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div>
        <AttendanceSummary />
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between px-4 py-3">
          <h1 className="text-lg font-semibold">Daily Logs</h1>

          <button className="text-sm text-primary hover:underline">
            Download Report
          </button>
        </div>

        {/* TABLE FIX */}
        <div className="overflow-hidden rounded-b-xl">
          <div className="">
            <DataTable
              name="dailyLogs"
              data={logsData}
              columns={columns}
              loading={false}
              visibilityToggle={false}
              pagination={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
