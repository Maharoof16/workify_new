"use client";

import { useState } from "react";
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

  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  const updateTime = (h = hour, m = minute, ap = ampm) => {
    const formatted = `${h}:${m} ${ap}`;
    onChange(formatted);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between font-normal"
        >
          {value || placeholder}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-3">
        {/* AM / PM Toggle */}
        <div className="flex bg-muted rounded-md p-1 mb-3">
          {["AM", "PM"].map((ap) => (
            <Button
              key={ap}
              type="button"
              size="sm"
              variant={ampm === ap ? "default" : "ghost"}
              className="flex-1"
              onClick={() => {
                setAmpm(ap as "AM" | "PM");
                updateTime(hour, minute, ap as "AM" | "PM");
              }}
            >
              {ap}
            </Button>
          ))}
        </div>

        {/* TIME PICKER */}
        <div className="flex gap-2">
          {/* HOURS */}
          <div className="flex-1 max-h-40 overflow-y-auto rounded-md border">
            {hours.map((h) => (
              <div
                key={h}
                onClick={() => {
                  setHour(h);
                  updateTime(h, minute, ampm);
                }}
                className={`px-3 py-1.5 text-sm cursor-pointer text-center
                  ${hour === h
                    ? "bg-primary text-white font-medium"
                    : "hover:bg-muted"}
                `}
              >
                {h}
              </div>
            ))}
          </div>

          {/* MINUTES */}
          <div className="flex-1 max-h-40 overflow-y-auto rounded-md border">
            {minutes.map((m) => (
              <div
                key={m}
                onClick={() => {
                  setMinute(m);
                  updateTime(hour, m, ampm);
                }}
                className={`px-3 py-1.5 text-sm cursor-pointer text-center
                  ${minute === m
                    ? "bg-primary text-white font-medium"
                    : "hover:bg-muted"}
                `}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}