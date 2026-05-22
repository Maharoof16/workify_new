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
import { ChevronDown, MoveLeft, MoveRight, Pencil } from "lucide-react";
import { useState } from "react";
// import { HolidayDialog } from "./holiday-dialog";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Holiday } from "../holiday";

const offDayConfig = {
  type: "WEEKLY",
  weeklyOffDays: [0, 6],
  customDates: [],
};

type CalendarCardProps = {
  currentMonth: Date;

  setCurrentMonth: React.Dispatch<
    React.SetStateAction<Date>
  >;

  holidays: Holiday[];

  loading?: boolean;
};

export function CalendarCard({
  currentMonth,
  setCurrentMonth,
  holidays,
  loading,
}: CalendarCardProps) {


  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [holidayId, setHolidayId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setHolidayId(id);
    setOpen(true);
  };

  const openCreateDialog = (date: Date) => {
    setHolidayId(null);
    setSelectedDate(date);
    setOpen(true);
  };

  const isOffDay = (date: Date) => {
    if (offDayConfig.type === "CUSTOM") {
      return offDayConfig.customDates.some((d) => isSameDay(parseISO(d), date));
    }
    return offDayConfig.weeklyOffDays.includes(date.getDay());
  };
const parsedHolidays = holidays.map((h) => ({
  ...h,

  dateObj: parseISO(h.date),
}));
 const getHoliday = (date: Date) =>
  parsedHolidays.filter((h) =>
    isSameDay(h.dateObj, date),
  );

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
    <div className=" flex flex-col gap-4 xl:col-span-7 rounded-xl border p-2 xl:p-4 border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-[18px] md:text-lg font-semibold text-center md:text-left">
          Holidays in {format(currentMonth, "MMMM yyyy")}
        </h2>

        <div className="flex items-center justify-between md:justify-end gap-1">
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
            <MoveLeft className="w-4 h-4" />
          </Button>

          <Popover open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="font-medium gap-1">
                {format(currentMonth, "MMMM, yyyy")}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-64 p-3">
              <div className="flex justify-between items-center">
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
                  <MoveLeft className="w-4 h-4" />
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
                  <MoveRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
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

              <div className="flex justify-between mt-3">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => {
                    setCurrentMonth(new Date());
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
            <MoveRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-180 flex flex-col gap-1">
          <div className="grid grid-cols-7 gap-1 overflow-hidden">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div
                key={d}
                className="p-2 border rounded-sm text-xs bg-background"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 grid-rows-6 gap-1">
            {days.map((date, i) => {
              const holidaysForDay = getHoliday(date);
              const off = isOffDay(date);

              return (
                <div
                  key={i}
                  className={`group relative border bg-background rounded-md p-2 flex flex-col justify-between min-h-25
                ${!isSameMonth(date, currentMonth) ? "bg-muted/30 text-muted-foreground/40" : ""}`}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 xl:top-1 xl:right-1 opacity-100 xl:opacity-0 group-hover:opacity-100 transition hover:bg-transparent focus:bg-transparent active:bg-transparent "
                    onClick={() => openCreateDialog(date)}
                  >
                    <Pencil className="h-2 w-2 text-muted-foreground hover:text-blue-500 transition-colors" />
                  </Button>
                  <span className="text-xs font-medium text-muted-foreground">
                    {format(date, "d")}
                  </span>

                  <div className="flex flex-col gap-1">
                    {off && (
                      <div className="text-[12px] px-2 py-0.5 rounded-[4px] w-full bg-muted text-muted-foreground">
                        Off Day
                      </div>
                    )}

                    {holidaysForDay.slice(0, 2).map((h) => (
                      <div
                        key={h.id}
                        className={`text-[12px] px-2 py-0.5 rounded-[4px] w-full truncate cursor-pointer ${getHolidayColor(
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
        </div>
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
