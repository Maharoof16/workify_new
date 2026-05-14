"use client";

import {
  addDays,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const currentYear = new Date().getFullYear();

export const holidayData = {
  year: currentYear,
  holidays: [
    {
      id: "new-year",
      date: `${currentYear}-01-01`,
      title: "New Year",
      category: "NATIONAL",
    },
    {
      id: "republic-day",
      date: `${currentYear}-01-26`,
      title: "Republic Day",
      category: "NATIONAL",
    },
    {
      id: "holi",
      date: `${currentYear}-03-03`,
      title: "Holi",
      category: "OCCASIONAL",
    },
    {
      id: "ugadi",
      date: `${currentYear}-03-19`,
      title: "Ugadi",
      category: "OCCASIONAL",
    },
    {
      id: "independence-day",
      date: `${currentYear}-08-15`,
      title: "Independence Day",
      category: "NATIONAL",
    },
    {
      id: "gandhi-jayanti",
      date: `${currentYear}-10-02`,
      title: "Gandhi Jayanti",
      category: "NATIONAL",
    },
    {
      id: "christmas",
      date: `${currentYear}-12-25`,
      title: "Christmas",
      category: "NATIONAL",
    },
  ],
};

const holidayPalette = [
  "bg-pink-500 text-white",
  "bg-blue-500 text-white",
  "bg-green-500 text-white",
  "bg-purple-500 text-white",
  "bg-orange-500 text-white",
];

const getHolidayColor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return holidayPalette[Math.abs(hash) % holidayPalette.length];
};

export function HolidaysCard() {
  const today = new Date();
  const router=useRouter();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth()),
  );
  const [selectedDate, setSelectedDate] = useState(today);

  const holidays = useMemo(
    () =>
      holidayData.holidays.map((h) => ({
        ...h,
        dateObj: parseISO(h.date),
      })),
    [],
  );

  const holidaysThisMonth = holidays.filter((h) =>
    isSameMonth(h.dateObj, currentMonth),
  );

  const getHolidayForDate = (date: Date) =>
    holidays.find((h) => isSameDay(h.dateObj, date));

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    addDays(weekStart, i),
  );

  return (
    <div className="w-full h-full rounded-2xl border bg-linear-to-b from-[#F6FAFE] to-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-gray-800">
          Upcoming Holidays
        </h2>

        <button className="text-sm text-blue-500 hover:underline cursor-pointer " onClick={()=> router.push("/timehub/holidays")}>
          View All →
        </button>
      </div>

      <div className="mb-4 rounded-xl border bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <div
            onClick={() => {
              const newDate = addDays(selectedDate, -7);
              setSelectedDate(newDate);
              setCurrentMonth(newDate);
            }}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border bg-gray-50 hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </div>

          <span className="text-sm font-semibold text-gray-800">
            {format(selectedDate, "MMMM yyyy")}
          </span>

          <div
            onClick={() => {
              const newDate = addDays(selectedDate, 7);
              setSelectedDate(newDate);
              setCurrentMonth(newDate);
            }}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border bg-gray-50 hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </div>
        </div>

        <div className="grid grid-cols-7 text-center text-[11px] text-gray-400">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={`${d}-${i}`}>{d}</div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 text-center text-sm">
          {weekDays.map((date) => {
            const isToday = isSameDay(date, today);
            const holiday = getHolidayForDate(date);

            return (
              <div
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`mx-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sm
                  ${isToday ? "bg-blue-600 text-white" : "text-gray-700"}
                  ${holiday && !isToday ? "font-semibold text-blue-600" : ""}
                  `}
              >
                {format(date, "d")}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {holidaysThisMonth.map((h) => {
          const badgeColor = getHolidayColor(h.id);

          return (
            <div
              key={h.id}
              className="flex items-center justify-between rounded-xl border bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold ${badgeColor}`}
                >
                  {format(h.dateObj, "dd")}
                </div>

                <span className="text-sm font-medium text-gray-800">
                  {format(h.dateObj, "MMM dd")} {h.title}
                </span>
              </div>

              <span className="text-xs text-blue-500 font-medium">
                {h.category === "NATIONAL"
                  ? "National Holiday"
                  : "Occasional Holiday"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
