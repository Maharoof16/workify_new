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
  reason: string;
  handoverNotes: string;
  files?: FileList;
};

type SessionType = "FULL" | "FIRST_HALF" | "SECOND_HALF";

function formatDate(date?: Date) {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

export default function LeaveForm() {
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
      reason: "",
      handoverNotes: "",
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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    if (!fileList || fileList.length === 0) {
      setValue("files", undefined);
      setSelectedFile(null);
      return;
    }

    const file = fileList[0];

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      setValue("files", undefined);
      setSelectedFile(null);
      alert("Only PDF, JPG, PNG allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setValue("files", undefined);
      setSelectedFile(null);
      alert("File must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setValue("files", fileList ?? undefined); 
  };

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

        {/* Reason */}
        <div className="col-span-6">
          <label className="label-primary">Reason For Leave</label>

          <textarea
            {...register("reason")}
            className="w-full rounded-md border px-3 py-2 text-sm h-28"
          />

          <span className="label-error">{errors.reason?.message}</span>
        </div>
        {/* Upload */}
        <div className="col-span-6">
          <div
            className="bg-muted border border-dashed rounded-xl py-8 flex flex-col items-center justify-center text-sm text-muted-foreground hover:bg-primary/5 transition cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudUpload className="text-primary" size={30} />

            <p className="font-medium text-primary">
              Click to upload supporting documents
            </p>
            <span className="text-xs">PDF, JPG or PNG (Max 5MB)</span>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {selectedFile && (
            <p className="text-sm text-primary mt-2 flex items-center gap-1">
              <File size={14} /> {selectedFile.name}
            </p>
          )}

          <span className="label-error">{errors.files?.message}</span>
        </div>

        {/* Actions */}
        <div className="col-span-6 flex gap-3 my-1">
          <Button type="submit" className="px-4">
            Apply Leave →
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
