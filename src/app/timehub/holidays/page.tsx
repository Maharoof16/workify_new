"use client"

import { CalendarCard } from "@/components/holidays/holiday-calender";
import { HolidayList } from "@/components/holidays/holiday-list";
import { useState } from "react";



export default function HolidaysPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <div className="space-y-3 p-2">
      <h1 className="text-2xl font-semibold">Holidays</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6">
        <CalendarCard
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
        />
        <HolidayList currentMonth={currentMonth} />
      </div>
    </div>
  );
}