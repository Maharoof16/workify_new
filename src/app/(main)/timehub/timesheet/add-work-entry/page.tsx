"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useForm, Controller } from "react-hook-form";
import {
  X,
  ChevronDown,
  Link2,
  Shield,
  FileText,
  Files,
} from "lucide-react";
import { TimesheetFormLayout } from "@/modules/timehub/timesheets/components/timesheet-form-layout";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { ProjectService } from "@/modules/my-org/projects/project.service";
import { TaskService } from "@/modules/my-org/tasks/task.service";
import type { Reference } from "@/modules/my-org/organization";
import type { TaskReferenceList } from "@/modules/my-org/tasks/task";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { TimesheetService } from "@/modules/timehub/timesheets/timesheet.service";
import type { CreateTimesheet } from "@/modules/timehub/timesheets/timesheet";
import { format, startOfWeek, endOfWeek } from "date-fns";

export type WorkEntryFormData = {
  date: string;
  projectId: string;
  projectLabel: string;
  taskId: string;
  taskLabel: string;
  taskDescription: string;
  startTime: string;
  endTime: string;
  hours: string;
};

type FileItem = {
  name: string;
  size: string;
  type: "pdf" | "jpg" | "mp4";
  status: "Uploaded" | "Uploading" | "Failed";
};

type Tab = "manual" | "bulk";

// Parse "HH:MM AM/PM" or "HH:MM" to total minutes for calculation
const parseTimeToMinutes = (time: string) => {
  if (!time) return 0;
  const cleaned = time.replace(/[^0-9:]/g, "");
  const parts = cleaned.split(":");
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
};

const normalizeToHHMM = (value: string) => {
  if (!value) return "";
  const cleaned = value.replace(/[^0-9:]/g, "");
  if (cleaned.includes(":")) {
    const parts = cleaned.split(":");
    const h = parts[0] || "0";
    const m = parts[1] || "0";
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  }
  const hours = parseInt(cleaned, 10);
  if (isNaN(hours)) return "";
  return `${String(hours).padStart(2, "0")}:00`;
};

const parseHoursToMinutes = (hoursStr: string): number => {
  if (!hoursStr) return 0;
  const cleaned = hoursStr.toLowerCase().trim();
  if (cleaned.includes("h")) {
    const parts = cleaned.split("h");
    const h = parseInt(parts[0], 10) || 0;
    let m = 0;
    if (parts[1]) {
      m = parseInt(parts[1].replace(/[^0-9]/g, ""), 10) || 0;
    }
    return h * 60 + m;
  }
  if (cleaned.includes(":")) {
    const parts = cleaned.split(":");
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    return h * 60 + m;
  }
  const val = parseFloat(cleaned);
  if (!isNaN(val)) {
    return Math.round(val * 60);
  }
  return 0;
};

const formatMinutesToXhYm = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

export default function AddWorkEntryPage() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm<WorkEntryFormData>({
    defaultValues: {
      date: "",
      projectId: "",
      projectLabel: "",
      taskId: "",
      taskLabel: "",
      taskDescription: "",
      startTime: "",
      endTime: "",
      hours: "",
    },
  });

  const userId = useSelector(
    (state: RootState) =>
      state.auth.userData?.memberId ||
      state.auth.userData?.orgMemberId ||
      state.auth.userData?.id,
  );

  const [projects, setProjects] = useState<Reference[]>([]);
  const [tasks, setTasks] = useState<TaskReferenceList[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingAddAnother, setIsSavingAddAnother] = useState(false);

  const didFetch = useRef(false);
  const taskCache = useRef<Record<string, TaskReferenceList[]>>({});

  useEffect(() => {
    if (!userId) return;

    if (didFetch.current) return;
    didFetch.current = true;

    const loadReferences = async () => {
      try {
        setLoadingProjects(true);

        const [projectData] = await Promise.all([
          ProjectService.getReferenceList({ memberId: userId }),
        ]);

        setProjects(projectData);
      } catch (error) {
        console.error("Failed to load references", error);
      } finally {
        setLoadingProjects(false);
      }
    };

    loadReferences();
  }, [userId]);

  const fetchTasksByProject = async (projectId: string) => {
    if (!projectId) return;

    if (taskCache.current[projectId]) {
      setTasks(taskCache.current[projectId]);
      return;
    }

    try {
      setLoadingTasks(true);
      const taskData = await TaskService.getReferenceList(projectId, userId);
      taskCache.current[projectId] = taskData;
      setTasks(taskData);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  const [linkInput, setLinkInput] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

    if (e.key === "Enter" || e.key === "ArrowRight") {
      if (isInput && target.tagName === "INPUT") {
        const input = target as HTMLInputElement;
        if (input.selectionStart !== input.value.length && e.key === "ArrowRight") {
          return;
        }
      }
      if (target.tagName === "TEXTAREA" && e.key === "Enter") {
        return;
      }
      e.preventDefault();
      const formEl = e.currentTarget;
      const focusables = Array.from(formEl.querySelectorAll('input, textarea, button.font-jakarta-regular')) as HTMLElement[];
      const idx = focusables.indexOf(target);
      if (idx !== -1 && idx < focusables.length - 1) {
        focusables[idx + 1].focus();
      }
    }

    if (e.key === "ArrowLeft") {
      if (isInput && target.tagName === "INPUT") {
        const input = target as HTMLInputElement;
        if (input.selectionStart !== 0) {
          return;
        }
      }
      e.preventDefault();
      const formEl = e.currentTarget;
      const focusables = Array.from(formEl.querySelectorAll('input, textarea, button.font-jakarta-regular')) as HTMLElement[];
      const idx = focusables.indexOf(target);
      if (idx > 0) {
        focusables[idx - 1].focus();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFileItems: FileItem[] = Array.from(e.target.files).map((f) => {
        const ext = f.name.split(".").pop()?.toLowerCase();
        let fileType: "pdf" | "jpg" | "mp4" = "pdf";
        if (ext === "jpg" || ext === "jpeg" || ext === "png") fileType = "jpg";
        else if (ext === "mp4" || ext === "mov" || ext === "avi")
          fileType = "mp4";
        return {
          name: f.name,
          size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
          type: fileType,
          status: "Uploaded",
        };
      });
      setFiles((prev) => [...prev, ...newFileItems]);
      toast.success("Files uploaded successfully");
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    toast.success("File removed");
  };

  const onSave = async (data: WorkEntryFormData, addAnother: boolean) => {
    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    if (addAnother) {
      setIsSavingAddAnother(true);
    } else {
      setIsSaving(true);
    }

    try {
      const entryDate = new Date(data.date);
      const selectedWeekStart = startOfWeek(entryDate, { weekStartsOn: 1 });
      const selectedWeekEnd = endOfWeek(entryDate, { weekStartsOn: 1 });

      const payload: CreateTimesheet = {
        periodStart: format(selectedWeekStart, "yyyy-MM-dd"),
        periodEnd: format(selectedWeekEnd, "yyyy-MM-dd"),
        type: "SAVE",
        time_entries: [
          {
            projectId: data.projectId,
            taskId: data.taskId || undefined,
            entryDate: data.date,
            startAt: new Date(`${data.date}T${data.startTime || "10:00"}:00`).toISOString(),
            endAt: new Date(`${data.date}T${data.endTime || "18:00"}:00`).toISOString(),
            description: data.taskDescription,
          },
        ],
      };

      await TimesheetService.saveOrSubmit(payload);
      toast.success("Work entry saved successfully");

      if (addAnother) {
        reset({
          date: "",
          projectId: "",
          projectLabel: "",
          taskId: "",
          taskLabel: "",
          taskDescription: "",
          startTime: "",
          endTime: "",
          hours: "",
        });
        setTasks([]);
      } else {
        router.push("/timehub/timesheet");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save work entry");
    } finally {
      setIsSaving(false);
      setIsSavingAddAnother(false);
    }
  };

  const handleSaveClick = (addAnother: boolean) => {
    handleSubmit((data) => onSave(data, addAnother))();
  };

  const fieldCls =
    "w-full px-4 py-2 bg-white border border-[#F3F4F6] rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#D9E7F2] transition-all placeholder-[#D9E7F2]";

  return (
    <TimesheetFormLayout>
      {/* Form Header */}
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Add Work Entry
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Precision in every hour. Log your architectural contributions
          with meticulous detail.
        </p>
      </div>

      {/* Tab strip — no bottom border; inner card top border is the divider */}
      <div className="px-4 flex">
        <button
          type="button"
          className="flex items-center gap-2 py-2.5 px-5 text-sm font-semibold border-b-4 transition-colors border-[#1482DD] text-[#1482DD]"
        >
          <FileText className="w-4 h-4" />
          Manual Entry
        </button>
        <button
          type="button"
          onClick={() => router.push("/timehub/timesheet/bulk-upload")}
          className="flex items-center gap-2 py-2.5 px-5 text-sm font-semibold border-b-4 transition-colors border-[#D9E7F2] text-[#6B7280] hover:text-[#4B5563]"
        >
          <Files className="w-4 h-4" />
          Bulk Upload
        </button>
      </div>

      {/* Inner bordered form card — top border aligns with tab underline */}
      <div className="px-4 pb-4">
        <div onKeyDown={handleFormKeyDown} className="border border-[#D9E7F2] rounded-md rounded-tl-none p-4 space-y-4 bg-transparent">
          {/* Date & Project Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block label-required">
                Date
              </label>
              <input
                type="date"
                className={`${fieldCls} ${errors.date ? "border-red-500 focus:ring-red-500/20" : ""}`}
                {...register("date", { required: "Date is required" })}
              />
              {errors.date && (
                <span className="label-error text-xs text-red-500 mt-1 block">{errors.date.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block label-required">
                Project
              </label>
              <Controller
                name="projectId"
                control={control}
                rules={{ required: "Project is required" }}
                render={({ field }) => (
                  <SearchableSelect
                    trim
                    value={field.value}
                    options={projects.map((p) => ({
                      id: p.id,
                      label: p.name,
                    }))}
                    disabled={loadingProjects}
                    placeholder={
                      loadingProjects ? (
                        <span className="flex items-center gap-2 animate-pulse text-primary">
                          Loading Projects...
                        </span>
                      ) : (
                        "Select any project"
                      )
                    }
                    onChange={(val, opt) => {
                      const pid = String(val);
                      field.onChange(pid);
                      setValue("projectLabel", opt?.label ?? "");
                      setValue("taskId", ""); // clear dependent task
                      setValue("taskLabel", "");
                      fetchTasksByProject(pid);
                    }}
                    className={`${errors.projectId ? "border-red-500" : "border-[#F3F4F6]"} text-sm shadow-none`}
                  />
                )}
              />
              {errors.projectId && (
                <span className="label-error text-xs text-red-500 mt-1 block">{errors.projectId.message}</span>
              )}
            </div>
          </div>

          {/* Task — dependent on Project */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block label-required">
              Task
            </label>
            <Controller
              name="taskId"
              control={control}
              rules={{ required: "Task is required" }}
              render={({ field }) => (
                <SearchableSelect
                  trim
                  value={field.value}
                  options={tasks.map((t) => ({ id: t.id, label: t.title }))}
                  disabled={!watch("projectId") || loadingTasks}
                  placeholder={
                    loadingTasks ? (
                      <span className="flex items-center gap-2 animate-pulse text-primary">
                        Loading Tasks...
                      </span>
                    ) : !watch("projectId") ? (
                      "Select project first"
                    ) : (
                      "Select Task"
                    )
                  }
                  onChange={(val, opt) => {
                    field.onChange(String(val));
                    setValue("taskLabel", opt?.label ?? "");
                  }}
                  className={`${errors.taskId ? "border-red-500" : "border-[#F3F4F6]"} text-sm`}
                />
              )}
            />
            {errors.taskId && (
              <span className="label-error text-xs text-red-500 mt-1 block">{errors.taskId.message}</span>
            )}
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block label-required">
              Task Description
            </label>
            <textarea
              placeholder="e.g., Drafting schematic designs for Level 4 atrium"
              rows={4}
              className={`${fieldCls} resize-y py-3 ${errors.taskDescription ? "border-red-500 focus:ring-red-500/20" : ""}`}
              {...register("taskDescription", { required: "Task Description is required" })}
            />
            {errors.taskDescription && (
              <span className="label-error text-xs text-red-500 mt-1 block">{errors.taskDescription.message}</span>
            )}
          </div>

          {/* Start Time / End Time / Hours — directly below Task Description */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-end">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block label-required">
                Start Time
              </label>
              <input
                type="text"
                placeholder="hh:mm"
                className={`${fieldCls} ${errors.startTime ? "border-red-500 focus:ring-red-500/20" : ""}`}
                {...register("startTime", {
                  required: "Start time is required",
                  onChange: (e) => {
                    const val = e.target.value;
                    const endTime = getValues("endTime");
                    if (/^\d{1,2}:\d{2}$/.test(val) && /^\d{1,2}:\d{2}$/.test(endTime)) {
                      const startMin = parseTimeToMinutes(val);
                      const endMin = parseTimeToMinutes(endTime);
                      if (endMin > startMin) {
                        setValue("hours", formatMinutesToXhYm(endMin - startMin));
                      }
                    }
                  },
                  onBlur: (e) => {
                    const val = e.target.value;
                    const normalized = normalizeToHHMM(val);
                    setValue("startTime", normalized);
                    const endTime = getValues("endTime");
                    if (normalized && endTime) {
                      const startMin = parseTimeToMinutes(normalized);
                      const endMin = parseTimeToMinutes(endTime);
                      if (endMin > startMin) {
                        setValue("hours", formatMinutesToXhYm(endMin - startMin));
                      }
                    }
                  }
                })}
              />
              {errors.startTime && (
                <span className="label-error text-xs text-red-500 mt-1 block">{errors.startTime.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block label-required">
                End Time
              </label>
              <input
                type="text"
                placeholder="hh:mm"
                className={`${fieldCls} ${errors.endTime ? "border-red-500 focus:ring-red-500/20" : ""}`}
                {...register("endTime", {
                  required: "End time is required",
                  onChange: (e) => {
                    const val = e.target.value;
                    const startTime = getValues("startTime");
                    if (/^\d{1,2}:\d{2}$/.test(val) && /^\d{1,2}:\d{2}$/.test(startTime)) {
                      const startMin = parseTimeToMinutes(startTime);
                      const endMin = parseTimeToMinutes(val);
                      if (endMin > startMin) {
                        setValue("hours", formatMinutesToXhYm(endMin - startMin));
                      }
                    }
                  },
                  onBlur: (e) => {
                    const val = e.target.value;
                    const normalized = normalizeToHHMM(val);
                    setValue("endTime", normalized);
                    const startTime = getValues("startTime");
                    if (startTime && normalized) {
                      const startMin = parseTimeToMinutes(startTime);
                      const endMin = parseTimeToMinutes(normalized);
                      if (endMin > startMin) {
                        setValue("hours", formatMinutesToXhYm(endMin - startMin));
                      }
                    }
                  }
                })}
              />
              {errors.endTime && (
                <span className="label-error text-xs text-red-500 mt-1 block">{errors.endTime.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block label-required">
                Hours
              </label>
              <input
                type="text"
                placeholder="0h 0m"
                className={`${fieldCls} ${errors.hours ? "border-red-500 focus:ring-red-500/20" : ""}`}
                {...register("hours", {
                  required: "Hours are required",
                  onChange: (e) => {
                    const val = e.target.value;
                    const mins = parseHoursToMinutes(val);
                    if (mins > 0) {
                      if (/^\d+(\.\d+)?(h|h\s*\d*m?)?$/.test(val.trim().toLowerCase())) {
                        const startTime = getValues("startTime") || "10:00";
                        if (!getValues("startTime")) {
                          setValue("startTime", startTime);
                        }
                        const startMin = parseTimeToMinutes(startTime);
                        const endMin = startMin + mins;
                        const endH = Math.floor(endMin / 60) % 24;
                        const endM = endMin % 60;
                        const endStr = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
                        setValue("endTime", endStr);
                      }
                    }
                  },
                  onBlur: (e) => {
                    const val = e.target.value;
                    const mins = parseHoursToMinutes(val);
                    if (mins > 0) {
                      const formatted = formatMinutesToXhYm(mins);
                      setValue("hours", formatted);
                      const startTime = getValues("startTime") || "10:00";
                      if (!getValues("startTime")) {
                        setValue("startTime", startTime);
                      }
                      const startMin = parseTimeToMinutes(startTime);
                      const endMin = startMin + mins;
                      const endH = Math.floor(endMin / 60) % 24;
                      const endM = endMin % 60;
                      const endStr = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
                      setValue("endTime", endStr);
                    }
                  }
                })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value;
                    const mins = parseHoursToMinutes(val);
                    if (mins > 0) {
                      const formatted = formatMinutesToXhYm(mins);
                      setValue("hours", formatted);
                      const startTime = getValues("startTime") || "10:00";
                      if (!getValues("startTime")) {
                        setValue("startTime", startTime);
                      }
                      const startMin = parseTimeToMinutes(startTime);
                      const endMin = startMin + mins;
                      const endH = Math.floor(endMin / 60) % 24;
                      const endM = endMin % 60;
                      const endStr = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
                      setValue("endTime", endStr);
                    }
                  }
                }}
              />
              {errors.hours && (
                <span className="label-error text-xs text-red-500 mt-1 block">{errors.hours.message}</span>
              )}
            </div>
          </div>

          {/* Action Buttons — moved inside the form */}
          <div className="flex items-center justify-between pt-4 mt-6 border-t border-[#D9E7F2] border-dashed gap-2">
            <div className="flex items-center gap-1.5 sm:gap-3">
              <Button
                type="button"
                onClick={() => handleSaveClick(false)}
                disabled={isSaving || isSavingAddAnother}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-2.5 py-1 sm:px-6 sm:py-2.5 text-[10px] sm:text-sm font-semibold h-7 sm:h-10 flex items-center justify-center shrink-0"
              >
                {isSaving ? (
                  <div className="flex items-center gap-1.5">
                    <Spinner size={14} color="#ffffff" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save Entry →"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSaveClick(true)}
                disabled={isSaving || isSavingAddAnother}
                className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md px-2.5 py-1 sm:px-6 sm:py-2.5 text-[10px] sm:text-sm font-medium h-7 sm:h-10 flex items-center justify-center shrink-0"
              >
                {isSavingAddAnother ? (
                  <div className="flex items-center gap-1.5">
                    <Spinner size={14} color="#475569" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save & Add Another"
                )}
              </Button>
            </div>
            <button
              type="button"
              onClick={() => router.push("/timehub/timesheet")}
              className="text-[10px] sm:text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors shrink-0 px-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </TimesheetFormLayout>
  );
}
