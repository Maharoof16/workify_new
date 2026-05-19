"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

type TimePickerProps = {
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
};

export function Timer({
  value,
  onChange,
  placeholder = "Select time",
}: TimePickerProps) {
  const [open, setOpen] = useState(false);

  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");

  useEffect(() => {
    if (!value) return;

    const [time, ap] = value.split(" ");
    const [h, m] = time.split(":");

    setHour(h);
    setMinute(m);
    setAmpm(ap as "AM" | "PM");
  }, [value]);

  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0"),
  );

  const updateTime = (h = hour, m = minute, ap = ampm) => {
    onChange(`${h}:${m} ${ap}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between font-normal rounded-sm h-10 border-none"
        >
          {value || placeholder}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto rounded-md">
        <div className="flex items-start gap-1.5">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-muted-foreground">Hour</span>

            <div
              className="
          h-48 w-19
          overflow-y-auto rounded-sm border
          bg-muted/20 p-0.5 custom-scrollbar
        "
            >
              {hours.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => {
                    setHour(h);

                    updateTime(h, minute, ampm);
                  }}
                  className={`
              mb-0.5 h-8 w-full rounded-sm
              text-sm font-medium transition-all cursor-pointer
              ${
                hour === h
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }
            `}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-muted-foreground">Minute</span>

            <div
              className="
         h-48 w-19
          overflow-y-auto rounded-sm border
          bg-muted/20 p-0.5 custom-scrollbar
        "
            >
              {minutes.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMinute(m);

                    updateTime(hour, m, ampm);
                  }}
                  className={`
              mb-0.5 h-8 w-full rounded-sm
              text-sm font-medium transition-all cursor-pointer
              ${
                minute === m
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }
            `}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-muted-foreground">Type</span>

            <div
              className=" 
         h-48 w-19
          rounded-sm border bg-muted/20
          p-0.5
        "
            >
              {["AM", "PM"].map((ap) => (
                <button
                  key={ap}
                  type="button"
                  onClick={() => {
                    setAmpm(ap as "AM" | "PM");

                    updateTime(hour, minute, ap as "AM" | "PM");
                  }}
                  className={`
              mb-0.5 h-8 w-full rounded-sm
              text-sm font-medium transition-all cursor-pointer
              ${
                ampm === ap
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }
            `}
                >
                  {ap}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
