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
import { ArrowLeft, ChevronDown, CloudUpload, File, MoveRight } from "lucide-react";
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
      <label className="label-primary label-required">{label}</label>

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
                  setPopoverOpen((prev) => ({
                    ...prev,
                    [name]: open,
                  }))
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={`
                    min-h-10 w-full justify-between
                    rounded-sm  text-sm font-normal shadow-none

                    ${
                      errors[name]
                        ? "border border-red-500"
                        : "border border-input"
                    }
                  `}
                  >
                    {field.value || `Select ${label}`}

                    <ChevronDown className="h-4 w-4 shrink-0" />
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
        className="grid grid-cols-6 gap-4"
      >
        <div className="col-span-6 md:col-span-3">
          <label className="label-primary label-required">Leave Type</label>

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
                className={`
                  h-10

                  ${
                    errors.leaveType
                      ? "border border-red-500 rounded-sm"
                      : "border rounded-sm"
                  }
                `}
              />
            )}
          />

          <span className="label-error">{errors.leaveType?.message}</span>
        </div>

        <div className="col-span-6 md:col-span-3">
          <label className="label-primary">Handover Notes</label>

          <input
            {...register("handoverNotes")}
            placeholder="Enter Notes"
            className="
      min-h-10 w-full rounded-sm
      border border-input 
      px-3 text-sm shadow-none
      focus:outline-none focus:ring-0
    "
          />
        </div>

        <div className="col-span-6 md:col-span-3">
          {renderDateField("fromDate", "From Date")}
        </div>

        <div className="col-span-6 md:col-span-3 flex xl:items-center xl:my-3 h-full">
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

        <div className="col-span-6 md:col-span-3">
          {renderDateField("toDate", "To Date")}
        </div>

        <div className="col-span-6 md:col-span-3 flex xl:items-center xl:my-3 h-full">
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

        <div className="col-span-6 ">
          <label className="label-primary label-required">
            Reason for Cancellation
          </label>

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
                className={`
                    h-10
                  ${
                    errors.cancellationReason
                      ? "border border-red-500 rounded-sm"
                      : "border rounded-sm"
                  }
                `}
              />
            )}
          />

          <span className="label-error">
            {errors.cancellationReason?.message}
          </span>
        </div>

        <div className="col-span-6">
          <label className="label-primary">Description</label>

          <textarea
            {...register("description")}
            placeholder="Enter description"
            className={`
      min-h-40 w-full resize-none
      rounded-sm bg-white
      px-3 py-3 text-sm
      shadow-none focus:outline-none focus:ring-0

      ${errors.description ? "border border-red-500" : "border border-input"}
    `}
          />

          <span className="label-error">{errors.description?.message}</span>
        </div>

        <div className="col-span-6 flex items-center gap-3 my-1">
  <Button
    type="submit"
    className="min-h-10 rounded-sm px-5 flex items-center gap-2"
  >
    Cancel Leave
    <MoveRight className="h-4 w-4" />
  </Button>

  <Button
    type="button"
    variant="secondary"
    onClick={() => router.back()}
    className="min-h-10 rounded-sm px-5 flex items-center gap-2"
  >
    <ArrowLeft className="h-4 w-4" />
    Go Back to Leave
  </Button>
</div>
      </form>
    </div>
  );
}
