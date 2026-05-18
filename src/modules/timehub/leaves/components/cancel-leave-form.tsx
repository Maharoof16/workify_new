"use client";

import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDown, CloudUpload, File } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useRouter } from "next/navigation";

type LeaveFormValues = {
  leaveType: string;
  fromDate: string;
  toDate: string;
  fromSession: "FULL" | "FIRST_HALF" | "SECOND_HALF";
  toSession: "FULL" | "FIRST_HALF" | "SECOND_HALF";
  description: string;
  handoverNotes: string;
  cancellationReason: string;
};

type SessionType = "FULL" | "FIRST_HALF" | "SECOND_HALF";

function formatDate(date?: Date) {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

export default function CancelLeaveForm() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LeaveFormValues>({
    defaultValues: {
      leaveType: "",
      fromDate: "",
      toDate: "",
      fromSession: "FULL",
      toSession: "FULL",
      description: "",
      handoverNotes: "",
      cancellationReason: "",
    },
  });

  const [popoverOpen, setPopoverOpen] = useState<{
    fromDate?: boolean;
    toDate?: boolean;
  }>({});

  const fromSession = watch("fromSession");
  const toSession = watch("toSession");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const onSubmit = (data: LeaveFormValues) => {
    console.log(data);
  };

  const renderDateField = (name: "fromDate" | "toDate", label: string) => (
    <div className="col-span-3">
      <label className="label-primary">{label}</label>

      <Controller
        name={name}
        control={control}
        rules={{ required: "Required" }}
        render={({ field }) => {
          const selectedDate = field.value ? new Date(field.value) : undefined;

          return (
            <>
              <Popover
                open={popoverOpen[name]}
                onOpenChange={(open) =>
                  setPopoverOpen((prev) => ({ ...prev, [name]: open }))
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={`w-full justify-between font-normal ${
                      errors[name] ? "border-red-500" : ""
                    }`}
                  >
                    {field.value || `Select ${label}`}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      field.onChange(formatDate(date));
                      setPopoverOpen((prev) => ({
                        ...prev,
                        [name]: false,
                      }));
                    }}
                  />
                </PopoverContent>
              </Popover>

              {errors[name] && (
                <span className="label-error">{errors[name]?.message}</span>
              )}
            </>
          );
        }}
      />
    </div>
  );

  const sessionOptions: { label: string; value: SessionType }[] = [
    { label: "Full Day", value: "FULL" },
    { label: "First Half-Day", value: "FIRST_HALF" },
    { label: "Second Half-Day", value: "SECOND_HALF" },
  ];

  return (
    <div className="w-full mx-auto h-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-6 gap-x-3 gap-y-1 "
      >
        {/* Leave Type */}
        <div className="col-span-6 md:col-span-3">
          <label className="label-primary">Leave Type</label>

          <Controller
            name="leaveType"
            control={control}
            rules={{ required: "Leave type required" }}
            render={({ field }) => (
              <SearchableSelect
                value={field.value || ""}
                placeholder="Select leave type"
                options={[
                  { id: "SICK", value: "SICK", label: "Sick Leave" },
                  { id: "PAID", value: "PAID", label: "Paid Leave" },
                  { id: "CASUAL", value: "CASUAL", label: "Casual Leave" },
                ]}
                onChange={(val) => field.onChange(val)}
                trim={false}
                className={
                  errors.leaveType
                    ? "border border-red-500 rounded-md"
                    : "border rounded-md"
                }
              />
            )}
          />

          <span className="label-error">{errors.leaveType?.message}</span>
        </div>

        {/* Handover */}
        <div className="col-span-6 md:col-span-3">
          <label className="label-primary">Handover Notes</label>

          <input
            {...register("handoverNotes")}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Enter Notes"
          />
        </div>

        {/* From Date */}
        <div className="col-span-6 md:col-span-3">
          {renderDateField("fromDate", "From Date")}
        </div>

        {/* From Session */}
        <div className="col-span-6 md:col-span-3">
          <div className="h-5 my-2" />

          <div className="flex items-center gap-4 flex-wrap">
            {sessionOptions.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <Checkbox
                  checked={fromSession === opt.value}
                  onCheckedChange={() => setValue("fromSession", opt.value)}
                  className="cursor-pointer"
                />
                <label className="text-sm cursor-pointer whitespace-nowrap">
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* To Date */}
        <div className="col-span-6 md:col-span-3">
          {renderDateField("toDate", "To Date")}
        </div>

        {/* To Session */}
        <div className="col-span-6 md:col-span-3">
          <div className="h-5 my-2" />

          <div className="flex items-center gap-4 flex-wrap">
            {sessionOptions.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <Checkbox
                  checked={toSession === opt.value}
                  onCheckedChange={() => setValue("toSession", opt.value)}
                  className="cursor-pointer"
                />
                <label className="text-sm cursor-pointer whitespace-nowrap">
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Cancellation Reason */}
        <div className="col-span-6 ">
          <label className="label-primary">Reason for Cancellation</label>

          <Controller
            name="cancellationReason"
            control={control}
            rules={{ required: "Reason is required" }}
            render={({ field }) => (
              <SearchableSelect
                value={field.value || ""}
                placeholder="Select reason"
                options={[
                  {
                    id: "PLANS_CHANGED",
                    value: "PLANS_CHANGED",
                    label: "Plans Changed",
                  },
                  {
                    id: "WORK_URGENT",
                    value: "WORK_URGENT",
                    label: "Urgent Work",
                  },
                  {
                    id: "HEALTH_RECOVERED",
                    value: "HEALTH_RECOVERED",
                    label: "Recovered from Illness",
                  },
                  {
                    id: "TRIP_CANCELLED",
                    value: "TRIP_CANCELLED",
                    label: "Trip Cancelled",
                  },
                ]}
                onChange={(val) => field.onChange(val)}
                trim={false}
                className={
                  errors.cancellationReason
                    ? "border border-red-500 rounded-md"
                    : "border rounded-md"
                }
              />
            )}
          />

          <span className="label-error">
            {errors.cancellationReason?.message}
          </span>
        </div>

        {/* Description */}
        <div className="col-span-6">
          <label className="label-primary">Description</label>

          <textarea
            {...register("description")}
            className="w-full rounded-md border px-3 py-2 text-sm h-40"
          />

          <span className="label-error">{errors.description?.message}</span>
        </div>

        {/* Actions */}
        <div className="col-span-6 flex gap-3 my-1">
          <Button type="submit" className="px-4">
            Cancel Leave →
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Go Back to Leave
          </Button>
        </div>
      </form>
    </div>
  );
}
