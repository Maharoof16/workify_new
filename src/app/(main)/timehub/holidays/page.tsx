"use client";

import { useEffect, useState } from "react";
import { CalendarCard } from "@/modules/timehub/holidays/components/holiday-calender";
import { HolidayList } from "@/modules/timehub/holidays/components/holiday-list";
import { Holiday } from "@/modules/timehub/holidays/holiday";
import { HolidayService } from "@/modules/timehub/holidays/holiday.service";

export default function HolidaysPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [holidays, setHolidays] = useState<Holiday[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      setLoading(true);

      const res = await HolidayService.getAll();

      setHolidays(res);
    } catch (error) {
      console.error("Failed to fetch holidays:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold">Holidays</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
        <div className="xl:col-span-5 min-w-0">
          <CalendarCard
            holidays={holidays}
            loading={loading}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
          />
        </div>

        <div className="xl:col-span-2 min-w-0">
          <HolidayList
            holidays={holidays}
            loading={loading}
            currentMonth={currentMonth}
          />
        </div>
      </div>
    </div>
  );
}
