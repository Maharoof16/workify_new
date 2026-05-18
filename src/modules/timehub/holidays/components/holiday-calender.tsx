"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import { Pencil } from "lucide-react";
import { useState } from "react";
// import { HolidayDialog } from "./holiday-dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { holidayData } from "./holiday-card";

const offDayConfig = {
  type: "WEEKLY", 
  weeklyOffDays: [0, 6], 
  customDates: [],
};

type CalendarCardProps = {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
};

export function CalendarCard({
  currentMonth,
  setCurrentMonth,
}: CalendarCardProps) {
  const holidays = (holidayData.holidays || []).map((h) => ({
    ...h,
    dateObj: parseISO(h.date),
  }));

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [holidayId, setHolidayId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setHolidayId(id);
    setOpen(true);
  };

  const openCreateDialog = (date: Date) => {
    setHolidayId(null); // 🔥 IMPORTANT
    setSelectedDate(date);
    setOpen(true);
  };

  const isOffDay = (date: Date) => {
    if (offDayConfig.type === "CUSTOM") {
      return offDayConfig.customDates.some((d) => isSameDay(parseISO(d), date));
    }
    return offDayConfig.weeklyOffDays.includes(date.getDay());
  };

  const getHoliday = (date: Date) =>
    holidays.filter((h) => isSameDay(h.dateObj, date));

  const start = startOfWeek(startOfMonth(currentMonth));
  const end = endOfWeek(endOfMonth(currentMonth));

  const days = [];
  let day = start;

  while (day <= end) {
    days.push(day);
    day = addDays(day, 1);
  }

  const HOLIDAY_COLOR_POOL = [
    "bg-[#FFB2EC4D] ",
    "bg-[#B2FFD24D] ",
    "bg-[#FFD0B24D] ",
    "bg-[#B2E8FF4D]",
  ];

  const getHolidayColor = (id: string) => {
    const index =
      id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      HOLIDAY_COLOR_POOL.length;

    return HOLIDAY_COLOR_POOL[index];
  };

  const [monthPickerOpen, setMonthPickerOpen] = useState(false);

  return (
    <div className="border rounded-xl bg-card flex flex-col gap-1 p-2">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">
          Holidays in {format(currentMonth, "MMMM yyyy")}
        </h2>

       <div className="flex items-center gap-2">
  {/* Prev */}
  <Button
    variant="ghost"
    size="sm"
    onClick={() =>
      setCurrentMonth(
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() - 1,
        ),
      )
    }
  >
    ←
  </Button>

  {/* Month Picker */}
<Popover open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
  <PopoverTrigger asChild>
    <Button variant="outline" className="font-medium">
      {format(currentMonth, "MMMM, yyyy")}
    </Button>
  </PopoverTrigger>

  <PopoverContent className="w-64 p-3">
    {/* Year */}
    <div className="flex justify-between items-center mb-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() =>
          setCurrentMonth(
            new Date(
              currentMonth.getFullYear() - 1,
              currentMonth.getMonth(),
            ),
          )
        }
      >
        ←
      </Button>

      <span className="font-medium">
        {currentMonth.getFullYear()}
      </span>

      <Button
        size="sm"
        variant="ghost"
        onClick={() =>
          setCurrentMonth(
            new Date(
              currentMonth.getFullYear() + 1,
              currentMonth.getMonth(),
            ),
          )
        }
      >
        →
      </Button>
    </div>

    {/* Months Grid */}
    <div className="grid grid-cols-4 gap-2">
      {[
        "Jan","Feb","Mar","Apr",
        "May","Jun","Jul","Aug",
        "Sep","Oct","Nov","Dec"
      ].map((m, i) => {
        const isActive = i === currentMonth.getMonth();

        return (
          <Button
            key={m}
            type="button"
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), i),
              );
              setMonthPickerOpen(false);
            }}
            className="w-full"
          >
            {m}
          </Button>
        );
      })}
    </div>

    {/* Footer */}
    <div className="flex justify-between mt-3">
      <Button
        variant="link"
        size="sm"
        onClick={() => {
          const today = new Date();
          setCurrentMonth(today);
          setMonthPickerOpen(false);
        }}
      >
        This month
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMonthPickerOpen(false)}
      >
        Close
      </Button>
    </div>
  </PopoverContent>
</Popover>

  {/* Next */}
  <Button
    variant="ghost"
    size="sm"
    onClick={() =>
      setCurrentMonth(
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
        ),
      )
    }
  >
    →
  </Button>
</div>
      </div>

      {/* WEEK HEADERS */}
      <div className="grid grid-cols-7 gap-1 bg-border rounded-md overflow-hidden">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
          <div key={d} className="px-2 py-1 border rounded-t-md">
            {d}
          </div>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 grid-rows-6 gap-1 ">
        {days.map((date, i) => {
          const holidaysForDay = getHoliday(date);
          const off = isOffDay(date);

          return (
            <div
              key={i}
              className={`group relative border rounded-md p-2 flex flex-col justify-between min-h-20
                ${!isSameMonth(date, currentMonth) ? "bg-muted/30 text-muted-foreground/40" : ""}`}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition"
                onClick={() => openCreateDialog(date)}
              >
                <Pencil className="text-muted-foreground"/>
              </Button>
              {/* DATE */}
              <span className="text-xs font-medium text-muted-foreground">
                {format(date, "d")}
              </span>

              {/* CONTENT */}
              <div className="flex flex-col gap-1">
                {off && (
                  <div className="text-[12px] px-2 py-0.5 rounded w-full bg-muted text-muted-foreground">
                    Off Day
                  </div>
                )}

                {holidaysForDay.slice(0, 2).map((h) => (
                  <div
                    key={h.id}
                    className={`text-[12px] px-2 py-0.5 rounded w-full truncate cursor-pointer ${getHolidayColor(
                      h.id,
                    )}`}
                    onClick={() => handleEdit(h.id)}
                  >
                    {h.title}
                  </div>
                ))}

                {holidaysForDay.length > 2 && (
                  <span className="text-[9px] text-muted-foreground">
                    +{holidaysForDay.length - 2} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* <HolidayDialog
        open={open}
        onClose={() => setOpen(false)}
        holidayId={holidayId}
        selectedDate={selectedDate}
      /> */}
    </div>
  );
}
