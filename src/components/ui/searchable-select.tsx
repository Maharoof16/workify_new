"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type Option = {
  id: string | number;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  disabled?: boolean;
  renderNode?: React.ReactNode;
  [key: string]: unknown;
};

type SearchableSelectProps = {
  value: string | number | undefined;
  onChange?: (val: string | number, option?: Option) => void;
  onOpen?: () => void;
  options: Option[];
  placeholder?: React.ReactNode;
  renderOptionIcon?: (option: Option) => React.ReactNode;
  className?: string;
  disabled?: boolean;
  trim?: boolean;
  mobileTrimLength?: number;
  tabletTrimLength?: number;
  desktopTrimLength?: number;
  trigger?: React.ReactNode;
  popOverWidthClass?: string;
};

export const SearchableSelect = React.memo(function SearchableSelect({
  value,
  onChange,
  onOpen,
  options,
  placeholder = "Select...",
  renderOptionIcon,
  disabled = false,
  className = "",
  trim = true,
  mobileTrimLength = 10,
  tabletTrimLength = 17,
  desktopTrimLength = 24,
  trigger,
  popOverWidthClass = "w-(--radix-popover-trigger-width)",
}: SearchableSelectProps) {
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState<"mobile" | "tablet" | "desktop">(
    "desktop",
  );

  React.useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setScreen("mobile");
      } else if (width < 1024) {
        setScreen("tablet");
      } else {
        setScreen("desktop");
      }
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const filteredOptions = useMemo(() => {
    const lower = filter.toLowerCase();
    return options?.filter((opt) => opt.label.toLowerCase().includes(lower));
  }, [filter, options]);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.id.toString() === value?.toString()),
    [options, value],
  );
  const trimText = (text: string) => {
    if (!trim) return text;

    let limit = desktopTrimLength;

    if (screen === "mobile") {
      limit = mobileTrimLength;
    } else if (screen === "tablet") {
      limit = tabletTrimLength;
    }

    return text.length > limit ? `${text.slice(0, limit)}…` : text;
  };


  const handleSelect = useCallback(
    (option: Option) => {
      if (onChange) onChange(option.id, option);
      setFilter("");
      setOpen(false);
    },
    [onChange],
  );

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (next && onOpen) {
        onOpen();
      }
      setOpen(next);
    },
    [onOpen],
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <Button
            variant="outline"
            type="button"
            className={cn(
              "font-jakarta-regular rounded-md w-full flex items-center justify-between",
              className,
            )}
            style={{ color: selectedOption?.color || "inherit" }}
            disabled={disabled}
            onClick={() => setOpen(true)}
          >
            <div className="flex items-center gap-2 truncate">
              {selectedOption && renderOptionIcon?.(selectedOption)}
              {selectedOption ? trimText(selectedOption.label) : placeholder}

            </div>
            <ChevronDown className="opacity-50" size={16} />
          </Button>
        )}
      </PopoverTrigger>

      {open && (
        <PopoverContent className={`min-w-64 ${popOverWidthClass}`}>
          <Input
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mb-2"
            autoFocus
            disabled={disabled}
          />
          <div
            className="max-h-48 overflow-auto grid grid-cols-1 gap-1"
            onWheel={(e) => (e.currentTarget.scrollTop += e.deltaY)}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  disabled={option.disabled}
                  className={cn(
                    "flex items-center gap-2 py-0.5 px-2 rounded text-sm truncate",
                    option.disabled
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-accent cursor-pointer",
                  )}
                  onClick={() => handleSelect(option)}
                  style={{ color: option.color || "inherit" }}
                >
                  {renderOptionIcon?.(option)}
                  {trimText(option.label)}

                </button>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                No results
              </p>
            )}
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
});
