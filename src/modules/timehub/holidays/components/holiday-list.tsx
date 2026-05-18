"use client";
import { Button } from "@/components/ui/button";
import { format, isSameMonth, parseISO } from "date-fns";
import { useState } from "react";
import { holidayData } from "./holiday-card";

type HolidayListProps = {
  currentMonth: Date;
};

export function HolidayList({ currentMonth }: HolidayListProps) {
  const [showAll, setShowAll] = useState(false);
  const holidays = (holidayData.holidays || []).map((h) => ({
    ...h,
    dateObj: parseISO(h.date),
  }));

  const holidaysThisMonth = holidays.filter((h) =>
    isSameMonth(h.dateObj, currentMonth),
  );

  const currentYear = currentMonth.getFullYear();

  const holidaysThisYear = holidays.filter(
    (h) => h.dateObj.getFullYear() === currentYear,
  );

  const data = showAll ? holidaysThisYear : holidaysThisMonth;

  return (
    <div className="border rounded-xl bg-card p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">List of Holidays</h2>
        <Button
          variant={"link"}
          className="text-xs text-blue-600"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? " ← View Less " : "View All →"}
        </Button>
      </div>

      {data.length === 0 ? (
        <p className="text-xs text-muted-foreground">No holidays this month</p>
      ) : (
        data.map((h) => (
          <div
            key={h.id}
            className="border rounded-md px-3 py-2 flex justify-between text-sm"
          >
            <span>{h.title}</span>
            <span className="text-xs text-muted-foreground">
              {format(h.dateObj, "MMMM d")}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
