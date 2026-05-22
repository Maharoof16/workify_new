"use client";

import { Button } from "@/components/ui/button";

import {
  format,
  isSameMonth,
  parseISO,
} from "date-fns";

import { useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { Holiday } from "../holiday";

import { Skeleton } from "@/components/ui/skeleton";

type HolidayListProps = {
  currentMonth: Date;

  holidays: Holiday[];

  loading?: boolean;
};

export function HolidayList({
  currentMonth,
  holidays,
  loading,
}: HolidayListProps) {
  const [showAll, setShowAll] =
    useState(false);

  const parsedHolidays = holidays.map((h) => ({
    ...h,

    dateObj: parseISO(h.date),
  }));

  const holidaysThisMonth =
    parsedHolidays.filter((h) =>
      isSameMonth(
        h.dateObj,
        currentMonth,
      ),
    );

  const currentYear =
    currentMonth.getFullYear();

  const holidaysThisYear =
    parsedHolidays.filter(
      (h) =>
        h.dateObj.getFullYear() ===
        currentYear,
    );

  const data = showAll
    ? holidaysThisYear
    : holidaysThisMonth;

  return (
    <div
      className="
        flex flex-col gap-2
        xl:col-span-7
        rounded-xl border
        p-3 xl:p-4
        border-dashboard-border
        bg-linear-to-b
        from-dashboard-card-from
        to-dashboard-card-to
      "
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          List of Holidays
        </h2>

        <Button
          variant="link"
          className="
            flex items-center gap-1
            text-xs text-blue-600
          "
          onClick={() =>
            setShowAll((prev) => !prev)
          }
        >
          {showAll ? (
            <>
              <ArrowLeft className="h-3 w-3" />
              View Less
            </>
          ) : (
            <>
              View All
              <ArrowRight className="h-3 w-3" />
            </>
          )}
        </Button>
      </div>

      {loading ? (
        Array.from({ length: 6 }).map(
          (_, i) => (
            <div
              key={i}
              className="
                flex items-center
                justify-between
                rounded-md border
                px-3 py-3
              "
            >
              <Skeleton className="h-4 w-32" />

              <Skeleton className="h-4 w-20" />
            </div>
          ),
        )
      ) : data.length === 0 ? (
        <p
          className="
            text-xs
            text-muted-foreground
          "
        >
          No holidays this month
        </p>
      ) : (
        data.map((h) => (
          <div
            key={h.id}
            className="
              flex justify-between
              rounded-md border
              px-3 py-2 text-sm
            "
          >
            <span>{h.title}</span>

            <span
              className="
                bg-background
                text-xs font-medium
              "
            >
              {format(
                h.dateObj,
                "MMMM d",
              )}
            </span>
          </div>
        ))
      )}
    </div>
  );
}