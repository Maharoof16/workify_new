"use client"


import { CalendarCard } from "@/modules/timehub/holidays/components/holiday-calender";
import { HolidayList } from "@/modules/timehub/holidays/components/holiday-list";
import { useState } from "react";



export default function HolidaysPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Holidays</h1>

      <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
        <div className="col-span-5">
        <CalendarCard
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
        />
        </div>
        <div className="col-span-2">
        <HolidayList currentMonth={currentMonth} />
        </div>
      </div>
    </div>
  );
}