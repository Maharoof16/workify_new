"use client";

import { addDays, format, isSameDay, parseISO, startOfWeek } from "date-fns";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const currentYear = new Date().getFullYear();

export const holidayData = {
  year: currentYear,
  holidays: [
    // NATIONAL
    {
      id: "new-year",
      date: `${currentYear}-01-01`,
      title: "New Year",
      category: "National",
    },
    {
      id: "republic-day",
      date: `${currentYear}-01-26`,
      title: "Republic Day",
      category: "National",
    },
    {
      id: "independence-day",
      date: `${currentYear}-08-15`,
      title: "Independence Day",
      category: "National",
    },
    {
      id: "gandhi-jayanti",
      date: `${currentYear}-10-02`,
      title: "Gandhi Jayanti",
      category: "National",
    },
    {
      id: "christmas",
      date: `${currentYear}-12-25`,
      title: "Christmas",
      category: "National",
    },

    // OPTIONAL
    {
      id: "makar-sankranti",
      date: `${currentYear}-01-14`,
      title: "Makar Sankranti",
      category: "Optional",
    },
    {
      id: "maha-shivaratri",
      date: `${currentYear}-02-26`,
      title: "Maha Shivaratri",
      category: "Optional",
    },
    {
      id: "raksha-bandhan",
      date: `${currentYear}-08-09`,
      title: "Raksha Bandhan",
      category: "Optional",
    },
    {
      id: "janmashtami",
      date: `${currentYear}-08-16`,
      title: "Janmashtami",
      category: "Optional",
    },
    {
      id: "karwa-chauth",
      date: `${currentYear}-10-10`,
      title: "Karwa Chauth",
      category: "Optional",
    },

    // OCCASIONAL
    {
      id: "holi",
      date: `${currentYear}-03-14`,
      title: "Holi",
      category: "Occasional",
    },
    {
      id: "ugadi",
      date: `${currentYear}-03-30`,
      title: "Ugadi",
      category: "Occasional",
    },
    {
      id: "ram-navami",
      date: `${currentYear}-04-06`,
      title: "Ram Navami",
      category: "Occasional",
    },
    {
      id: "eid",
      date: `${currentYear}-03-31`,
      title: "Eid-ul-Fitr",
      category: "Occasional",
    },
    {
      id: "ganesh-chaturthi",
      date: `${currentYear}-08-27`,
      title: "Ganesh Chaturthi",
      category: "Occasional",
    },
    {
      id: "dussehra",
      date: `${currentYear}-10-01`,
      title: "Dussehra",
      category: "Occasional",
    },
    {
      id: "diwali",
      date: `${currentYear}-10-20`,
      title: "Diwali",
      category: "Occasional",
    },
  ],
};

const holidayPalette = [
  "status-info",
  "status-success",
  "status-warning",
  "status-danger",
  "status-neutral",
];

const getHolidayColors = (
  holidays: Array<
    (typeof holidayData.holidays)[number] & {
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

  const holidays = useMemo(
    () =>
      holidayData.holidays
        .map((h) => ({
          ...h,
          dateObj: parseISO(h.date),
        }))
        .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime()),
    [],
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
            variant="ghost"
            size="sm"
            className="text-primary"
            onClick={() => router.push("/timehub/holidays")}
          >
            View All
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
          {visibleHolidays.map((h) => {
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
