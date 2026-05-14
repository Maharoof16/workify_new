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
import { Timer } from "@/components/ui/timer";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useRouter } from "next/navigation";

type CompOffFormValues = {
  compOffType: string;
  desiredDate: string;
  fromTime: string;
  toTime: string;
  reason: string;
  files?: FileList;
};

function formatDate(date?: Date) {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

export default function CompOffForm() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompOffFormValues>();

  const [popoverOpen, setPopoverOpen] = useState<{
    desiredDate?: boolean;
  }>({});

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const onSubmit = (data: CompOffFormValues) => {
    console.log(data);
  };

  const renderDateField = () => (
    <div className="col-span-6 md:col-span-3">
      <label className="label-primary">Desired Date</label>

      <Controller
        name="desiredDate"
        control={control}
        rules={{ required: "Required" }}
        render={({ field }) => {
          const selectedDate = field.value ? new Date(field.value) : undefined;

          return (
            <>
              <Popover
                open={popoverOpen.desiredDate}
                onOpenChange={(open) => setPopoverOpen({ desiredDate: open })}
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={`w-full justify-between font-normal ${
                      errors.desiredDate ? "border-red-500" : ""
                    }`}
                  >
                    {field.value || "Select Desired Date"}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      field.onChange(formatDate(date));
                      setPopoverOpen({ desiredDate: false });
                    }}
                  />
                </PopoverContent>
              </Popover>

              {errors.desiredDate && (
                <span className="label-error">
                  {errors.desiredDate.message}
                </span>
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

  return (
    <div className="w-full mx-auto h-full rounded-2xl border p-3 shadow-sm flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Comp Off Request</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-6 gap-2"
      >
        {/* Comp Off Type */}
        <div className="col-span-6 md:col-span-3">
          <label className="label-primary">Comp Off Type</label>

          <Controller
            name="compOffType"
            control={control}
            rules={{ required: "Required" }}
            render={({ field }) => (
              <SearchableSelect
                value={field.value || ""}
                placeholder="Select Absence type"
                options={[
                  { id: "WEEKEND", value: "WEEKEND", label: "Weekend Work" },
                  { id: "HOLIDAY", value: "HOLIDAY", label: "Holiday Work" },
                  { id: "EXTRA", value: "EXTRA", label: "Extra Hours" },
                ]}
                onChange={(val: string | number | undefined) =>
                  field.onChange(val)
                }
                trim={false}
                className={
                  errors.compOffType
                    ? "border border-red-500 rounded-md"
                    : "border rounded-md"
                }
              />
            )}
          />

          <span className="label-error">{errors.compOffType?.message}</span>
        </div>

        {/* Desired Date */}
        {renderDateField()}

        {/* Time Range */}
        <div className="col-span-6 grid grid-cols-2 gap-3">
          {/* FROM TIME */}
          <div>
            <label className="label-primary">From Time</label>

            <Controller
              name="fromTime"
              control={control}
              rules={{ required: "Start time is required" }}
              render={({ field }) => (
                <Timer value={field.value} onChange={field.onChange} />
              )}
            />

            <span className="label-error">{errors.fromTime?.message}</span>
          </div>

          {/* TO TIME */}
          <div>
            <label className="label-primary">To Time</label>

            <Controller
              name="toTime"
              control={control}
              rules={{
                required: "End time is required",
                validate: (value) => {
                  const start = watch("fromTime");

                  if (!start || !value) return true;

                  return value > start || "End time must be after start time";
                },
              }}
              render={({ field }) => (
                <Timer value={field.value} onChange={field.onChange} />
              )}
            />

            <span className="label-error">{errors.toTime?.message}</span>
          </div>
        </div>
        {/* Reason */}
        <div className="col-span-6">
          <label className="label-primary">Reason For Absence</label>

          <textarea
            {...register("reason")}
            className={`w-full rounded-md border px-3 py-2 text-sm h-44 ${
              errors.reason ? "border-red-500" : ""
            }`}
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
        <div className="col-span-6 flex gap-3">
          <Button type="submit" className="px-6">
            Submit Request →
          </Button>

          <Button type="button" variant="secondary" onClick={()=> router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
