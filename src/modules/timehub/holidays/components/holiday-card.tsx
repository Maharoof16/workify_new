"use client";

import { addDays, format, isSameDay, parseISO, startOfWeek } from "date-fns";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Holiday } from "../holiday";
import { HolidayService } from "../holiday.service";
import { Skeleton } from "@/components/ui/skeleton";

const holidayPalette = [
  "status-info",
  "status-success",
  "status-warning",
  "status-danger",
  "status-neutral",
];

const getHolidayColors = (
  holidays: Array<
    Holiday & {
      dateObj: Date;
    }
  >,
) => {
  return holidays.map((holiday, index) => ({
    ...holiday,
    color: holidayPalette[index % holidayPalette.length],
  }));
};

export function HolidaysCard() {
  const today = new Date();

  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(today);
  const [holidaysData, setHolidaysData] = useState<Holiday[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      setLoading(true);

      const res = await HolidayService.getAll();

      setHolidaysData(res);
    } catch (error) {
      console.error("Failed to fetch holidays:", error);
    } finally {
      setLoading(false);
    }
  };
  const holidays = useMemo(
    () =>
      holidaysData
        .map((h) => ({
          ...h,
          dateObj: parseISO(h.date),
        }))
        .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime()),
    [holidaysData],
  );

  const holidaysWithColors = getHolidayColors(holidays);

  const getHolidayForDate = (date: Date) =>
    holidays.find((h) => isSameDay(h.dateObj, date));

  const weekStart = startOfWeek(selectedDate, {
    weekStartsOn: 0,
  });

  const weekDays = Array.from({
    length: 7,
  }).map((_, i) => addDays(weekStart, i));

  // Always show max 2 holidays
  const visibleHolidays = useMemo(() => {
    const weekEnd = addDays(weekStart, 6);

    // Holidays in current week
    const weekHolidays = holidaysWithColors.filter(
      (h) => h.dateObj >= weekStart && h.dateObj <= weekEnd,
    );

    // If 2 holidays exist in week
    if (weekHolidays.length >= 2) {
      return weekHolidays.slice(0, 2);
    }

    // Upcoming holidays after current week
    const futureHolidays = holidaysWithColors.filter(
      (h) => h.dateObj > weekEnd,
    );

    // Merge current week + future
    const merged = [...weekHolidays, ...futureHolidays];

    // Keep consistent layout
    return merged.slice(0, 2);
  }, [holidaysWithColors, weekStart]);

  return (
    <Card
      className="
        h-full rounded-xl
        border-dashboard-border
        bg-linear-to-b
        from-dashboard-card-from
        to-dashboard-card-to
        shadow-none
      "
    >
      <CardContent className="flex h-full flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Upcoming Holidays</h2>

          <Button
            variant={"link"}
            onClick={() => router.push("/timehub/holidays")}
          >
            View All →
          </Button>
        </div>

        {/* Calendar */}
        <div
          className="
            mb-4 rounded-xl
            border border-dashboard-border
            bg-card p-4
          "
        >
          {/* Month Nav */}
          <div className="mb-3 flex items-center justify-between">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full"
              onClick={() => {
                const newDate = addDays(selectedDate, -7);

                setSelectedDate(newDate);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm font-semibold">
              {format(selectedDate, "MMMM yyyy")}
            </span>

            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full"
              onClick={() => {
                const newDate = addDays(selectedDate, 7);

                setSelectedDate(newDate);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 text-center text-[11px] text-muted-foreground">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={`${d}-${i}`}>{d}</div>
            ))}
          </div>

          {/* Dates */}
          <div className="mt-2 grid grid-cols-7 text-center text-sm">
            {weekDays.map((date) => {
              const isToday = isSameDay(date, today);

              const holiday = getHolidayForDate(date);

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    mx-auto flex h-9 w-9
                    items-center justify-center
                    rounded-full text-sm
                    transition-colors

                    ${
                      isToday
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground"
                    }

                    ${holiday && !isToday ? "font-semibold text-primary" : ""}
                  `}
                >
                  {format(date, "d")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Holiday List */}
        <div className="flex-1 space-y-3 overflow-auto pr-1">
          {loading
            ? Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="
            flex items-center justify-between
            rounded-md border
            border-dashboard-border
            bg-card px-3 py-2
          "
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-7 w-7 rounded-md" />

                    <Skeleton className="h-4 w-36" />
                  </div>

                  <Skeleton className="h-4 w-24" />
                </div>
              ))
            : visibleHolidays.map((h) => {
                const badgeColor = h.color;

                return (
                  <div
                    key={h.id}
                    className="
                  flex items-center justify-between
                  rounded-md border
                  border-dashboard-border
                  bg-card px-3 py-2
                "
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                      flex h-7 w-7 items-center
                      justify-center rounded-md
                      text-xs font-semibold
                      ${badgeColor}
                    `}
                      >
                        {format(h.dateObj, "dd")}
                      </div>

                      <span className="text-sm font-medium">
                        {format(h.dateObj, "MMM dd")} {h.title}
                      </span>
                    </div>

                    <span
                      className="
                    text-xs font-medium
                    text-primary
                  "
                    >
                      {h.category} Holiday
                    </span>
                  </div>
                );
              })}
        </div>
      </CardContent>
    </Card>
  );
}
