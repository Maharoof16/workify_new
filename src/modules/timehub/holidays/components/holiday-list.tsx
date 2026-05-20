"use client";
import { Button } from "@/components/ui/button";
import { format, isSameMonth, parseISO } from "date-fns";
import { useState } from "react";
import { holidayData } from "./holiday-card";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
    <div className=" flex flex-col gap-2 xl:col-span-7 rounded-xl border p-3 xl:p-4 border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">List of Holidays</h2>
        <Button
          variant="link"
          className="text-xs text-blue-600 flex items-center gap-1"
          onClick={() => setShowAll((prev) => !prev)}
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

      {data.length === 0 ? (
        <p className="text-xs text-muted-foreground">No holidays this month</p>
      ) : (
        data.map((h) => (
          <div
            key={h.id}
            className="border rounded-md px-3 py-2 flex justify-between text-sm"
          >
            <span>{h.title}</span>
            <span className="text-xs font-medium bg-background">
              {format(h.dateObj, "MMMM d")}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
