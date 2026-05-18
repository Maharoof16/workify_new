"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type FormValues = {
  leaveType: string;
  fromDate: string;
  toDate: string;
  fromSession: string;
  toSession: string;
  reason: string;
  description: string;
  handoverNotes: string;
};

function formatDate(date?: Date) {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

export default function ModifyLeaveForm() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const [popoverOpen, setPopoverOpen] = useState<any>({});

  const fromSession = watch("fromSession");
  const toSession = watch("toSession");

  const sessionOptions = [
    { label: "Full Day", value: "FULL" },
    { label: "First Half-Day", value: "FIRST_HALF" },
    { label: "Second Half-Day", value: "SECOND_HALF" },
  ];

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  const renderDate = (name: "fromDate" | "toDate", label: string) => (
    <div className="col-span-3">
      <label className="label-primary">{label}</label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <Popover
              open={popoverOpen[name]}
              onOpenChange={(open) =>
                setPopoverOpen((prev: any) => ({ ...prev, [name]: open }))
              }
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between font-normal"
                >
                  {field.value || "MM/DD/YYYY"}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    field.onChange(formatDate(date));
                    setPopoverOpen((prev: any) => ({
                      ...prev,
                      [name]: false,
                    }));
                  }}
                />
              </PopoverContent>
            </Popover>
          </>
        )}
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto border rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Modify Leave Request</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-6 gap-x-4 gap-y-4"
      >
        {/* Leave Type */}
        <div className="col-span-3">
          <label className="label-primary">Leave Type</label>

          <Controller
            name="leaveType"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value || ""}
                placeholder="Casual Leave"
                options={[
                  { id: "CASUAL", value: "CASUAL", label: "Casual Leave" },
                  { id: "SICK", value: "SICK", label: "Sick Leave" },
                ]}
                onChange={(val) => field.onChange(val)}
              />
            )}
          />
        </div>

        {/* Handover Notes */}
        <div className="col-span-3">
          <label className="label-primary">Handover Notes</label>
          <input
            {...register("handoverNotes")}
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="Project handover status.."
          />
        </div>

        {/* From Date */}
        {renderDate("fromDate", "From Date")}

        {/* From Session */}
        <div className="col-span-3 flex items-center gap-4 mt-6">
          {sessionOptions.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <Checkbox
                checked={fromSession === opt.value}
                onCheckedChange={() => setValue("fromSession", opt.value)}
              />
              <span className="text-sm">{opt.label}</span>
            </div>
          ))}
        </div>

        {/* To Date */}
        {renderDate("toDate", "To Date")}

        {/* To Session */}
        <div className="col-span-3 flex items-center gap-4 mt-6">
          {sessionOptions.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <Checkbox
                checked={toSession === opt.value}
                onCheckedChange={() => setValue("toSession", opt.value)}
              />
              <span className="text-sm">{opt.label}</span>
            </div>
          ))}
        </div>

        {/* Reason */}
        <div className="col-span-6">
          <label className="label-primary">Reason For Cancellation</label>

          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value || ""}
                placeholder="Plans Changed"
                options={[
                  { id: "PLAN", value: "PLAN", label: "Plans Changed" },
                  { id: "MEDICAL", value: "MEDICAL", label: "Medical" },
                ]}
                onChange={(val) => field.onChange(val)}
              />
            )}
          />
        </div>

        {/* Description */}
        <div className="col-span-6">
          <label className="label-primary">Description</label>
          <textarea
            {...register("description")}
            className="w-full border rounded-md px-3 py-2 text-sm h-32"
            placeholder="Describe your reason..."
          />
        </div>

        {/* Buttons */}
        <div className="col-span-6 flex gap-4 mt-2">
          <Button type="submit" className="px-6">
            Cancel Leave →
          </Button>

          <Button type="button" variant="secondary">
            Go Back to Leave
          </Button>
        </div>
      </form>
    </div>
  );
}
