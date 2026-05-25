"use client";

import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useRouter } from "next/navigation";
import { MoveRight } from "lucide-react";

type DepartmentFormValues = {
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
};

export default function DepartmentForm() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    defaultValues: {
      name: "",
      description: "",
      status: "ACTIVE",
    },
  });

  const onSubmit = (data: DepartmentFormValues) => {
    console.log(data);
  };

  return (
    <div className="w-full mx-auto h-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-6 gap-4"
      >
        <div className="col-span-6 md:col-span-3">
          <label className="label-primary label-required">
            Department Name
          </label>

          <input
            {...register("name", {
              required: "Department name is required",
            })}
            placeholder="Enter department name"
            className={`
              min-h-10 w-full rounded-sm
              px-3 text-sm shadow-none
              focus:outline-none focus:ring-0
              ${
                errors.name
                  ? "border border-red-500"
                  : "border border-input"
              }
            `}
          />

          <span className="label-error">
            {errors.name?.message}
          </span>
        </div>

        <div className="col-span-6 md:col-span-3">
          <label className="label-primary label-required">
            Status
          </label>

          <Controller
            name="status"
            control={control}
            rules={{ required: "Status is required" }}
            render={({ field }) => (
              <SearchableSelect
                value={field.value || ""}
                placeholder="Select status"
                options={[
                  {
                    id: "ACTIVE",
                    value: "ACTIVE",
                    label: "Active",
                  },
                  {
                    id: "INACTIVE",
                    value: "INACTIVE",
                    label: "Inactive",
                  },
                ]}
                onChange={(val) => field.onChange(val)}
                trim={false}
                className={`
                  h-10
                  ${
                    errors.status
                      ? "border border-red-500 rounded-sm"
                      : "border rounded-sm"
                  }
                `}
              />
            )}
          />

          <span className="label-error">
            {errors.status?.message}
          </span>
        </div>

        <div className="col-span-6">
          <label className="label-primary">
            Description
          </label>

          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            placeholder="Enter department description"
            className="
              min-h-28 w-full rounded-md
              px-3 py-3 text-sm shadow-none
              focus:outline-none focus:ring-0
              resize-none border"
          />
        </div>

        <div className="col-span-6 flex items-center gap-3 my-1">
          <Button
            type="submit"
            className="min-h-10 rounded-sm px-5 flex items-center gap-2"
          >
            Save Department
            <MoveRight className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="min-h-10 rounded-sm px-5"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}