"use client";

import { useState, useMemo, useCallback, memo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  PlusCircle,
  Pencil,
} from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { ProjectService } from "@/modules/my-org/projects/project.service";
import { TaskService } from "@/modules/my-org/tasks/task.service";
import type { Reference } from "@/modules/my-org/organization";
import type { TaskReferenceList } from "@/modules/my-org/tasks/task";
import { TimesheetService } from "@/modules/timehub/timesheets/timesheet.service";
import type { CreateTimesheet } from "@/modules/timehub/timesheets/timesheet";
import { startOfWeek, endOfWeek, format, addWeeks, addDays } from "date-fns";
import { TimesheetStatusBadge } from "@/modules/timehub/timesheets/components/timesheetStatusBadge";
import { TimesheetMetricCards } from "@/modules/timehub/timesheets/components/metric-cards";
import { TimesheetCharts } from "@/modules/timehub/timesheets/components/timesheet-charts";

type SelectOption = { id: string; value: string; label: string };

type RowLoading = {
  projects: boolean;
  tasks: boolean;
};

type WorkEntry = {
  rowKey: number;
  id?: string;
  date: string;
  projectId: string;
  taskId: string;
  hours: string;
  description: string;
  status: string;
  startTime: string;
  endTime: string;
  projectLabel: string;
  taskLabel: string;
  projectOptions: SelectOption[];
  taskOptions: SelectOption[];
  loading: RowLoading;
  isLocked?: boolean;
  billable?: boolean;
};

let rowKeyCounter = 0;
const newKey = () => ++rowKeyCounter;

const parseLocalDate = (dateStr: string) => {
  if (!dateStr) return undefined;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const formatLocalDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

function toOption(
  item: { id: string; name?: string; title?: string },
  labelKey: string = "name",
): SelectOption {
  return {
    id: item.id,
    value: item.id,
    label: (labelKey === "title" ? item.title : item.name) ?? "",
  };
}

function makeEmptyRow(dateStr?: string): WorkEntry {
  const t = newKey();
  return {
    rowKey: t,
    id: `temp-${t}`,
    date: dateStr || "",
    projectId: "",
    taskId: "",
    hours: "",
    description: "",
    status: "Draft",
    startTime: "",
    endTime: "",
    projectLabel: "",
    taskLabel: "",
    projectOptions: [],
    taskOptions: [],
    loading: {
      projects: false,
      tasks: false,
    },
    isLocked: false,
    billable: true,
  };
}

const parseTimeToMinutes = (time: string) => {
  if (!time) return 0;
  const [h = 0, m = 0] = time.split(":").map(Number);
  return h * 60 + m;
};

const formatMinutesToHHMM = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const normalizeToHHMMSS = (value: string) => {
  if (!value) return "";
  const cleaned = value.replace(/[^0-9:]/g, "");
  if (cleaned.includes(":")) {
    const parts = cleaned.split(":");
    const h = parts[0] || "0";
    const m = parts[1] || "0";
    const s = parts[2] || "0";
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}:${s.padStart(2, "0")}`;
  }
  const hours = parseInt(cleaned, 10);
  if (isNaN(hours)) return "";
  return `${String(hours).padStart(2, "0")}:00:00`;
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

const COLUMNS = [
  { label: "Date", width: "100px" },
  { label: "Project", width: "160px" },
  { label: "Task", width: "180px" },
  { label: "Hours", width: "90px" },
  { label: "Start Time", width: "100px" },
  { label: "End Time", width: "100px" },
  { label: "Status", width: "90px" },
] as const;

function TableSkeleton() {
  return (
    <div
      className="overflow-x-auto overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 18rem)" }}
    >
      <table className="w-full caption-bottom text-sm table-fixed border-collapse">
        <colgroup>
          {COLUMNS.map((col, i) => (
            <col key={i} style={{ width: col.width }} />
          ))}
        </colgroup>
        <TableHeader className="sticky top-0 z-10">
          <TableRow>
            {COLUMNS.map((col, i) => (
              <TableHead
                key={i}
                className="h-10 text-left text-xs font-semibold text-[#6B7280] tracking-wider border-b border-[#F3F4F6] bg-[#F9FAFB] sticky top-0 z-10"
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow
              key={i}
              className={`table-auto border-b border-[#F3F4F6] ${i % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"}`}
            >
              <TableCell>
                <Skeleton className="h-7 w-full rounded-sm" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-7 w-full rounded-sm" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-7 w-full rounded-sm" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-7 w-full rounded-sm" />
              </TableCell>
              <TableCell className="py-2.5 px-3">
                <Skeleton className="h-7 w-full rounded-sm" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-7 w-full rounded-sm" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-7 w-full rounded-sm" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </table>
    </div>
  );
}

export default function TimeSheet() {
  const userId = useSelector((state: RootState) => state.auth.userData?.id);

  const [tableLoading, setTableLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [timesheetStatus, setTimesheetStatus] = useState<string | null>(null);
  const [timesheetIsLocked, setTimesheetIsLocked] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<WorkEntry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingEntry, setIsDeletingEntry] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);

  const [projects, setProjects] = useState<Reference[]>([]);
  const [tasksByProject, setTasksByProject] = useState<
    Record<string, TaskReferenceList[]>
  >({});
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingTasksMap, setLoadingTasksMap] = useState<
    Record<string, boolean>
  >({});

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

  const fetchTasksByProject = useCallback(
    async (projectId: string) => {
      if (!projectId || !userId) return;

      if (taskCache.current[projectId]) {
        setTasksByProject((prev) => ({
          ...prev,
          [projectId]: taskCache.current[projectId],
        }));
        return;
      }

      try {
        setLoadingTasksMap((prev) => ({ ...prev, [projectId]: true }));
        const taskData = await TaskService.getReferenceList(projectId, userId);
        taskCache.current[projectId] = taskData;
        setTasksByProject((prev) => ({ ...prev, [projectId]: taskData }));
      } catch (error) {
        console.error("Failed to fetch tasks", error);
        setTasksByProject((prev) => ({ ...prev, [projectId]: [] }));
      } finally {
        setLoadingTasksMap((prev) => ({ ...prev, [projectId]: false }));
      }
    },
    [userId],
  );

  const projectOptions = useMemo(
    () => projects.map((p) => ({ id: p.id, value: p.id, label: p.name })),
    [projects],
  );

  const [rows, setRows] = useState<WorkEntry[]>([]);
  const [savedRows, setSavedRows] = useState<WorkEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const hasDailyLimitError = useMemo(() => {
    const dailyTotals: Record<string, number> = {};
    rows.forEach((r) => {
      if (r.date) {
        const mins = parseHoursToMinutes(r.hours);
        dailyTotals[r.date] = (dailyTotals[r.date] || 0) + mins;
      }
    });
    return Object.values(dailyTotals).some((mins) => mins > 24 * 60);
  }, [rows]);

  // Metric Calculations
  const {
    computedTotalHours,
    computedBillableHours,
    computedBillablePercentage,
    computedPendingApprovals,
    computedActiveProjects,
    rawTotalHours,
    computedDailyHours,
    computedProjectHours,
  } = useMemo(() => {
    let totalMins = 0;
    let billableMins = 0;
    const projectIds = new Set<string>();
    let pendingCount = 0;
    const dailyMins = [0, 0, 0, 0, 0, 0, 0];
    const projectMinsMap: Record<string, number> = {};

    savedRows.forEach((r) => {
      const mins = parseHoursToMinutes(r.hours);
      totalMins += mins;

      const isRowBillable = r.billable !== false;
      if (isRowBillable) {
        billableMins += mins;
      }

      if (r.projectId) {
        projectIds.add(r.projectId);
        const label = r.projectLabel || r.projectId;
        projectMinsMap[label] = (projectMinsMap[label] || 0) + mins;
      }

      if (r.date) {
        const parsedDate = new Date(r.date);
        if (!isNaN(parsedDate.getTime())) {
          const day = parsedDate.getDay();
          const adjustedDayIndex = day === 0 ? 6 : day - 1;
          dailyMins[adjustedDayIndex] += mins;
        }
      }

      const lowerStatus = String(r.status).toLowerCase();
      if (lowerStatus === "pending" || lowerStatus === "submitted") {
        pendingCount++;
      }
    });

    const cappedBillableMins = Math.min(billableMins, 2400); // Max 40 hours

    const formatDecimalHours = (minutes: number): string => {
      const h = minutes / 60;
      return Number(h.toFixed(1)).toString() + "h";
    };

    const percentage = `${Math.round((cappedBillableMins / 2400) * 100)}%`;

    const computedDailyHours = dailyMins.map((m) => m / 60);

    const computedProjectHours = Object.entries(projectMinsMap)
      .map(([name, mins]) => ({
        name,
        hours: mins / 60,
      }))
      .sort((a, b) => b.hours - a.hours);

    return {
      computedTotalHours: formatDecimalHours(totalMins),
      computedBillableHours: formatDecimalHours(cappedBillableMins),
      computedBillablePercentage: percentage,
      computedPendingApprovals: pendingCount,
      computedActiveProjects: projectIds.size,
      rawTotalHours: totalMins / 60,
      computedDailyHours,
      computedProjectHours,
    };
  }, [savedRows]);

  // Week navigation
  const getWeekStart = (d: Date): Date => {
    const day = d.getDay(); // 0=Sun
    const diff = day === 0 ? -6 : 1 - day; // shift to Monday
    const mon = new Date(d);
    mon.setDate(d.getDate() + diff);
    mon.setHours(0, 0, 0, 0);
    return mon;
  };

  const [currentWeek, setCurrentWeek] = useState<Date>(() =>
    getWeekStart(new Date()),
  );

  const isNextWeekInFuture = useMemo(() => {
    const nextWeekStart = addWeeks(currentWeek, 1);
    nextWeekStart.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return nextWeekStart > today;
  }, [currentWeek]);

  const isOnOrAfterFriday = useMemo(() => {
    const fridayDate = addDays(currentWeek, 4);
    fridayDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return today >= fridayDate;
  }, [currentWeek]);

  const fetchTimesheet = useCallback(async (signal?: AbortSignal) => {
    const selectedWeekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const selectedWeekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

    const periodStart = format(selectedWeekStart, "yyyy-MM-dd");
    const periodEnd = format(selectedWeekEnd, "yyyy-MM-dd");

    try {
      setTableLoading(true);
      const res = await TimesheetService.getbyperiod(periodStart, periodEnd, signal);

      if (signal?.aborted) return;

      if (!res.data || !res.data.timeEntries?.length) {
        const emptyRow = makeEmptyRow("");
        setRows([emptyRow]);
        setSavedRows([]);
        setTimesheetStatus(null);
        setTimesheetIsLocked(false);
        return;
      }

      setTimesheetStatus(res.data.status || null);
      setTimesheetIsLocked(!!res.data.isLocked);

      const formatMinutes = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
      };

      const sortedEntries = [...res.data.timeEntries].sort(
        (a: any, b: any) =>
          new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime(),
      );

      const newRows = sortedEntries.map((item: any) => ({
        rowKey: newKey(),
        id: item.id,
        date: item.entryDate.split("T")[0],
        projectId: item.projectId || item.project?.id || "",
        taskId: item.taskId || item.task?.id || "",
        hours: formatMinutes(item.totalMinutes),
        description: item.description || "",
        status:
          item.status === "SUBMITTED"
            ? "Pending"
            : item.status === "APPROVED"
              ? "Approved"
              : item.status === "REJECTED"
                ? "Rejected"
                : item.status,
        startTime: item.startAt
          ? format(new Date(item.startAt), "HH:mm")
          : "",
        endTime: item.endAt ? format(new Date(item.endAt), "HH:mm") : "",
        projectLabel: item.project?.name || "",
        taskLabel: item.task?.title || "",
        projectOptions: [],
        taskOptions: [],
        loading: { projects: false, tasks: false },
        isLocked: !!item.isLocked,
        billable: item.billable !== false,
      }));

      setRows(newRows);
      setSavedRows(newRows);
    } catch (err: any) {
      if (err.name === "CanceledError" || err.name === "AbortError" || signal?.aborted) {
        return;
      }
      console.error(err);
      toast.error("Failed to load timesheet");
      setRows([]);
      setSavedRows([]);
    } finally {
      if (!signal?.aborted) {
        setTableLoading(false);
      }
    }
  }, [currentWeek]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchTimesheet(abortController.signal);
    return () => {
      abortController.abort();
    };
  }, [fetchTimesheet]);

  const weekEnd = new Date(currentWeek);
  weekEnd.setDate(currentWeek.getDate() + 6);

  const fmtDate = (d: Date): string =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const fmtDateYear = (d: Date): string =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const weekLabel = `${fmtDate(currentWeek)} – ${fmtDateYear(weekEnd)}`;

  const handlePrevWeek = () => {
    const prev = new Date(currentWeek);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeek(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeek);
    next.setDate(next.getDate() + 7);
    setCurrentWeek(next);
  };



  const filteredRows = useMemo(() => {
    let filtered = rows;

    if (!isEditingEnabled) {
      filtered = filtered.filter((r) => !String(r.id).startsWith("temp-"));
    }

    // Filter by tab (status)
    if (selectedTab === "pending") {
      filtered = filtered.filter((r) => r.status === "Pending");
    } else if (selectedTab === "approved") {
      filtered = filtered.filter((r) => r.status === "Approved");
    } else if (selectedTab === "rejected") {
      filtered = filtered.filter((r) => r.status === "Rejected");
    }

    return filtered;
  }, [rows, selectedTab, isEditingEnabled]);

  const tabCounts = useMemo(
    () => {
      let activeRows = (savedRows.length === 0 && !isEditingEnabled) ? [] : rows;
      if (!isEditingEnabled) {
        activeRows = activeRows.filter((r) => !String(r.id).startsWith("temp-"));
      }
      return {
        all: activeRows.length,
        pending: activeRows.filter((r) => r.status === "Pending").length,
        approved: activeRows.filter((r) => r.status === "Approved").length,
        rejected: activeRows.filter((r) => r.status === "Rejected").length,
      };
    },
    [rows, savedRows, isEditingEnabled],
  );

  const handleRowClick = (id: string | undefined) => {
    if (editingId === id) {
      setEditingId(null);
      return;
    }

    setEditingId(id || null);
    if (id) {
      const row = rows.find((r) => r.id === id);
      if (row && row.projectId) {
        fetchTasksByProject(row.projectId);
      }
    }
  };

  const handleFieldChange = (
    id: string | undefined,
    field: string,
    value: string,
  ) => {
    if (!id) return;
    setRows((prevRows) =>
      prevRows.map((r) => {
        if (r.id !== id) return r;
        const updatedRow = { ...r, [field]: value };

        if (field === "startTime" || field === "endTime") {
          if (updatedRow.startTime && updatedRow.endTime) {
            if (/^\d{1,2}:\d{2}$/.test(updatedRow.startTime) && /^\d{1,2}:\d{2}$/.test(updatedRow.endTime)) {
              const startMin = parseTimeToMinutes(updatedRow.startTime);
              const endMin = parseTimeToMinutes(updatedRow.endTime);
              if (endMin > startMin) {
                updatedRow.hours = formatMinutesToXhYm(endMin - startMin);
              }
            }
          }
        } else if (field === "hours") {
          const durationMin = parseHoursToMinutes(value);
          if (durationMin > 0) {
            if (/^\d+(\.\d+)?(h|h\s*\d*m?)?$/.test(value.trim().toLowerCase())) {
              const startStr = updatedRow.startTime || "10:00";
              if (!updatedRow.startTime) {
                updatedRow.startTime = startStr;
              }
              const startMin = parseTimeToMinutes(startStr);
              const endMin = startMin + durationMin;
              const endH = Math.floor(endMin / 60) % 24;
              const endM = endMin % 60;
              updatedRow.endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
            }
          }
        }

        return updatedRow;
      }),
    );
  };

  // Dedicated handler for project selection — updates both projectId + projectLabel atomically
  const handleProjectChange = (
    id: string | undefined,
    projectId: string,
    projectLabel: string,
  ) => {
    if (!id) return;
    setRows((prevRows) =>
      prevRows.map((r) =>
        r.id === id
          ? { ...r, projectId, projectLabel, taskId: "", taskLabel: "" }
          : r,
      ),
    );
    fetchTasksByProject(projectId);
  };

  const handleTaskChange = (
    id: string | undefined,
    taskId: string,
    taskLabel: string,
  ) => {
    if (!id) return;
    setRows((prevRows) =>
      prevRows.map((r) => (r.id === id ? { ...r, taskId, taskLabel } : r)),
    );
  };

  const handleDeleteRow = (id: string | undefined) => {
    if (!id) return;
    const row = rows.find((r) => r.id === id);
    if (!row) return;

    const isSaved = !String(row.id).startsWith("temp-");
    const hasData = row.projectId || row.taskId || row.hours || row.description;

    if (isSaved || hasData) {
      setRowToDelete(row);
    } else {
      setRows((prev) => prev.filter((r) => r.id !== id));
      if (editingId === id) {
        setEditingId(null);
      }
    }
  };

  const confirmDeleteRow = async () => {
    if (!rowToDelete?.id) return;
    const isSaved = !String(rowToDelete.id).startsWith("temp-");
    try {
      setIsDeletingEntry(true);
      if (isSaved) {
        await TimesheetService.deleteEntry(rowToDelete.id);
      }
      setRows((prev) => prev.filter((r) => r.id !== rowToDelete.id));
      setSavedRows((prev) => prev.filter((r) => r.id !== rowToDelete.id));
      if (editingId === rowToDelete.id) {
        setEditingId(null);
      }
      setRowToDelete(null);
      toast.success("Entry deleted");
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete entry");
    } finally {
      setIsDeletingEntry(false);
    }
  };

  const handleSave = async () => {
    if (isSaving || isSubmitting) return;
    try {
      setIsSaving(true);
      const selectedWeekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
      const selectedWeekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
      
      const payload: CreateTimesheet = {
        periodStart: format(selectedWeekStart, "yyyy-MM-dd"),
        periodEnd: format(selectedWeekEnd, "yyyy-MM-dd"),
        type: "SAVE",
        time_entries: rows
          .filter((r) => r.projectId && r.date)
          .map((r) => {
            const entryId = String(r.id).startsWith("temp-") ? undefined : r.id;
            return {
              id: entryId,
              projectId: r.projectId,
              taskId: r.taskId || undefined,
              entryDate: r.date,
              startAt: new Date(`${r.date}T${r.startTime || "10:00"}:00`).toISOString(),
              endAt: new Date(`${r.date}T${r.endTime || "18:00"}:00`).toISOString(),
              description: r.description,
              billable: true,
              totalMinutes: parseHoursToMinutes(r.hours),
              status: r.status || "DRAFT",
            };
          }),
      };

      await TimesheetService.saveOrSubmit(payload);
      toast.success("Changes saved successfully");
      await fetchTimesheet();
      setEditingId(null);
      setIsEditingEnabled(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save timesheet");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (isSaving || isSubmitting) return;
    try {
      setIsSubmitting(true);
      const selectedWeekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
      const selectedWeekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
      
      const payload: CreateTimesheet = {
        periodStart: format(selectedWeekStart, "yyyy-MM-dd"),
        periodEnd: format(selectedWeekEnd, "yyyy-MM-dd"),
        type: "SUBMIT",
        time_entries: rows
          .filter((r) => r.projectId && r.date)
          .map((r) => {
            const entryId = String(r.id).startsWith("temp-") ? undefined : r.id;
            return {
              id: entryId,
              projectId: r.projectId,
              taskId: r.taskId || undefined,
              entryDate: r.date,
              startAt: new Date(`${r.date}T${r.startTime || "10:00"}:00`).toISOString(),
              endAt: new Date(`${r.date}T${r.endTime || "18:00"}:00`).toISOString(),
              description: r.description,
              billable: true,
              totalMinutes: parseHoursToMinutes(r.hours),
              status: "SUBMITTED",
            };
          }),
      };

      await TimesheetService.saveOrSubmit(payload);
      toast.success("Timesheet submitted successfully");
      await fetchTimesheet();
      setEditingId(null);
      setIsEditingEnabled(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit timesheet");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setRows(savedRows);
    setEditingId(null);
    setIsEditingEnabled(false);
    toast.info("Changes discarded");
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-4 gap-2">
          <h1 className="text-xl font-bold sm:text-2xl text-slate-800">Timesheet</h1>
          <Link href="/timehub/timesheet/add-work-entry">
            <Button className="w-auto sm:w-44 h-8 sm:h-10 px-3 sm:px-4 flex items-center text-xs sm:text-[14px] justify-center gap-1.5 sm:gap-2 font-semibold">
              <PlusCircle className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
              Add Work Entry
            </Button>
          </Link>
        </div>
      </div>

      <TimesheetMetricCards
        totalHours={computedTotalHours}
        billableHours={computedBillableHours}
        billablePercentage={computedBillablePercentage}
        pendingApprovalsCount={computedPendingApprovals}
        activeProjectsCount={computedActiveProjects}
      />

      <TimesheetCharts
        totalHours={rawTotalHours}
        dailyHours={computedDailyHours}
        projectHours={computedProjectHours}
      />

      <div className="flex gap-6 border-b border-[#F3F4F6] w-full relative z-10 overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide pt-2">
        <button
          onClick={() => setSelectedTab("all")}
          className={`pb-3 pr-2 flex items-center text-sm font-semibold transition-colors ${
            selectedTab === "all"
              ? "text-blue-500 border-b-2 border-blue-500 -mb-[1px]"
              : "text-slate-500 hover:text-slate-700 border-b-2 border-transparent -mb-[1px]"
          }`}
        >
          All Entries
          <span className="ml-3 px-2.5 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold">
            {tabCounts.all}
          </span>
        </button>
        <button
          onClick={() => setSelectedTab("pending")}
          className={`pb-3 px-2 flex items-center text-sm font-semibold transition-colors ${
            selectedTab === "pending"
              ? "text-blue-500 border-b-2 border-blue-500 -mb-[1px]"
              : "text-slate-500 hover:text-slate-700 border-b-2 border-transparent -mb-[1px]"
          }`}
        >
          Pending
          <span className="ml-3 px-2.5 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold">
            {tabCounts.pending}
          </span>
        </button>
        <button
          onClick={() => setSelectedTab("approved")}
          className={`pb-3 px-2 flex items-center text-sm font-semibold transition-colors ${
            selectedTab === "approved"
              ? "text-blue-500 border-b-2 border-blue-500 -mb-[1px]"
              : "text-slate-500 hover:text-slate-700 border-b-2 border-transparent -mb-[1px]"
          }`}
        >
          Approved
          <span className="ml-3 px-2.5 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold">
            {tabCounts.approved}
          </span>
        </button>
        <button
          onClick={() => setSelectedTab("rejected")}
          className={`pb-3 px-2 flex items-center text-sm font-semibold transition-colors ${
            selectedTab === "rejected"
              ? "text-blue-500 border-b-2 border-blue-500 -mb-[1px]"
              : "text-slate-500 hover:text-slate-700 border-b-2 border-transparent -mb-[1px]"
          }`}
        >
          Rejected
          <span className="ml-3 px-2.5 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold">
            {tabCounts.rejected}
          </span>
        </button>
      </div>

      <div className={`!mt-0 ${!isEditingEnabled ? "mb-6" : ""}`}>
        <div className="w-full border border-[#F3F4F6] border-t-0 bg-white">
          <div className="py-2.5 px-2 lg:py-3 lg:px-4 border-b border-[#F3F4F6] flex items-center justify-between gap-1.5 lg:gap-3 group">
            <span className="font-semibold text-[11px] lg:text-sm text-slate-800 shrink-0">
              Recent Entries
            </span>
            {/* Week Navigator */}
            <div className="flex items-center gap-1 lg:gap-3 shrink-0">
              {!tableLoading && <TimesheetStatusBadge status={timesheetStatus} />}
              <div className="flex items-center rounded-md border border-[#F3F4F6] overflow-hidden bg-white w-fit shrink-0">
                <button
                  type="button"
                  onClick={handlePrevWeek}
                  className="h-6 w-6 lg:h-7 lg:w-7 flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0"
                >
                  <ChevronLeft className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-slate-500 shrink-0" />
                </button>
 
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="px-1 lg:px-3 text-[9px] lg:text-xs font-medium text-slate-600 border-x border-[#F3F4F6] h-6 lg:h-7 flex items-center hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                    >
                      <CalendarIcon className="mr-0.5 lg:mr-2 h-2.5 w-2.5 lg:h-3 lg:w-3 opacity-70 shrink-0" />
                      {weekLabel}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={currentWeek}
                      captionLayout="dropdown"
                      startMonth={new Date(new Date().getFullYear() - 10, 0)}
                      endMonth={new Date(new Date().getFullYear() + 10, 11)}
                      onSelect={(date) => {
                        if (date) {
                          const mon = new Date(date);
                          const day = mon.getDay(); // 0=Sun
                          const diff = day === 0 ? -6 : 1 - day; // shift to Monday
                          mon.setDate(mon.getDate() + diff);
                          mon.setHours(0, 0, 0, 0);
                          setCurrentWeek(mon);
                          setIsCalendarOpen(false);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
 
                <button
                  type="button"
                  onClick={handleNextWeek}
                  disabled={isNextWeekInFuture}
                  className={`h-6 w-6 lg:h-7 lg:w-7 flex items-center justify-center transition-colors shrink-0 ${isNextWeekInFuture ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"}`}
                >
                  <ChevronRight className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-slate-500 shrink-0" />
                </button>
              </div>
 
              <button
                type="button"
                onClick={() => {
                  if (isEditingEnabled) {
                    setRows(savedRows.length > 0 ? savedRows : [makeEmptyRow("")]);
                  }
                  setIsEditingEnabled(!isEditingEnabled);
                }}
                className={`transition-all duration-150 p-1 lg:p-1.5 rounded-full hover:bg-slate-100 focus:outline-none flex items-center justify-center border opacity-100 lg:opacity-0 lg:group-hover:opacity-100 shrink-0 ${
                  isEditingEnabled
                    ? "text-blue-600 border-blue-200 bg-blue-50/50"
                    : "text-slate-400 hover:text-slate-600 border-slate-100 bg-white"
                }`}
                title={isEditingEnabled ? "Disable Editing" : "Enable Editing"}
              >
                <Pencil className="h-3 w-3 lg:h-3.5 lg:w-3.5 shrink-0" />
              </button>
            </div>
          </div>

          {tableLoading ? (
            <TableSkeleton />
          ) : (
            <div
              className="overflow-x-auto overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 18rem)" }}
            >
              <table className="w-full caption-bottom text-sm table-fixed border-collapse">
                <colgroup>
                  {COLUMNS.map((col, i) => (
                    <col key={i} style={{ width: col.width }} />
                  ))}
                </colgroup>

                <TableHeader className="sticky top-0 z-10">
                  <TableRow className="border-b border-[#F3F4F6] hover:bg-transparent">
                    {COLUMNS.map((col, i) => (
                      <TableHead
                        key={i}
                        className="h-10 text-left text-xs font-semibold text-[#6B7280] bg-[#F9FAFB] border-b border-[#F3F4F6] sticky top-0 z-10"
                      >
                        {col.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={COLUMNS.length}
                        className="h-24 text-center text-sm text-[#6B7280] font-medium bg-white"
                      >
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRows.map((row, idx) => {
                      const isRowEditable = isEditingEnabled && !timesheetIsLocked && !row.isLocked;
                      const isNewRow = String(row.id).startsWith("temp-");
                      const isEditingMode = isEditingEnabled && (isNewRow || editingId === row.id);
                      const dateMins = row.date ? rows.reduce((sum, r) => r.date === row.date ? sum + parseHoursToMinutes(r.hours) : sum, 0) : 0;
                      const hasError = dateMins > 24 * 60;
                      const isExpanded = isEditingEnabled && editingId === row.id;

                      return (
                        <WorkEntryRow
                          key={row.rowKey}
                          row={row}
                          isColored={idx % 2 === 1}
                          isEditing={isEditingMode}
                          isEditable={isRowEditable}
                          isExpanded={isExpanded}
                          showDelete={isRowEditable}
                          hasError={hasError}
                          onRowClick={() => {
                            if (isEditingEnabled) {
                              handleRowClick(row.id);
                            }
                          }}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onFieldChange={handleFieldChange}
                          onProjectChange={handleProjectChange}
                          onTaskChange={handleTaskChange}
                          projectOptions={projectOptions}
                          taskOptions={
                            tasksByProject[row.projectId]?.map((t) => ({
                              id: t.id,
                              value: t.id,
                              label: t.title,
                            })) || []
                          }
                          loadingProjects={loadingProjects}
                          loadingTasks={loadingTasksMap[row.projectId] || false}
                        />
                      );
                    })
                  )}
                </TableBody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isEditingEnabled && !timesheetIsLocked && (rows.length === 0 || rows.some((r) => !r.isLocked)) && (
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="default"
            onClick={() =>
              setRows([
                makeEmptyRow(""),
                ...rows,
              ])
            }
          >
            Add Row
          </Button>
          <div className="flex gap-2">
            <Button variant="default" onClick={handleSave} disabled={isSaving || isSubmitting || hasDailyLimitError}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
             <Button
              variant="default"
              onClick={handleSubmit}
              disabled={!isOnOrAfterFriday || isSaving || isSubmitting || hasDailyLimitError}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      )}

      <Dialog
        open={rowToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isDeletingEntry) setRowToDelete(null);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete entry</DialogTitle>
          </DialogHeader>

          <div className="text-sm text-muted-foreground">
            Are you sure you want to delete this time entry? This action cannot
            be undone.
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              disabled={isDeletingEntry}
              onClick={() => setRowToDelete(null)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              disabled={isDeletingEntry}
              onClick={confirmDeleteRow}
            >
              {isDeletingEntry ? (
                <div className="flex items-center gap-2">
                  <Spinner size={16} />
                </div>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type RowProps = {
  row: WorkEntry;
  isColored: boolean;
  isEditing: boolean;
  isEditable: boolean;
  isExpanded: boolean;
  showDelete: boolean;
  onRowClick: () => void;
  onDeleteRow: () => void;
  onFieldChange: (id: string | undefined, field: string, value: string) => void;
  onProjectChange: (
    id: string | undefined,
    projectId: string,
    projectLabel: string,
  ) => void;
  onTaskChange: (
    id: string | undefined,
    taskId: string,
    taskLabel: string,
  ) => void;
  projectOptions: SelectOption[];
  taskOptions: SelectOption[];
  loadingProjects: boolean;
  loadingTasks: boolean;
  hasError?: boolean;
};

const WorkEntryRow = memo(function WorkEntryRow({
  row,
  isColored,
  isEditing,
  isEditable,
  isExpanded,
  showDelete,
  onRowClick,
  onDeleteRow,
  onFieldChange,
  onProjectChange,
  onTaskChange,
  projectOptions,
  taskOptions,
  loadingProjects,
  loadingTasks,
  hasError,
}: RowProps) {
  const handleRowKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    const target = e.target as HTMLElement;
    const isInput = target.tagName === "INPUT";

    if (e.key === "Enter" || e.key === "ArrowRight") {
      if (isInput) {
        const input = target as HTMLInputElement;
        if (input.selectionStart !== input.value.length && e.key === "ArrowRight") {
          return;
        }
      }
      e.preventDefault();
      const rowEl = e.currentTarget;
      const focusables = Array.from(rowEl.querySelectorAll('input, button.font-jakarta-regular')) as HTMLElement[];
      const idx = focusables.indexOf(target);
      if (idx !== -1 && idx < focusables.length - 1) {
        focusables[idx + 1].focus();
      }
    }

    if (e.key === "ArrowLeft") {
      if (isInput) {
        const input = target as HTMLInputElement;
        if (input.selectionStart !== 0) {
          return;
        }
      }
      e.preventDefault();
      const rowEl = e.currentTarget;
      const focusables = Array.from(rowEl.querySelectorAll('input, button.font-jakarta-regular')) as HTMLElement[];
      const idx = focusables.indexOf(target);
      if (idx > 0) {
        focusables[idx - 1].focus();
      }
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const rowEl = e.currentTarget;
      const focusables = Array.from(rowEl.querySelectorAll('input, button.font-jakarta-regular')) as HTMLElement[];
      const idx = focusables.indexOf(target);
      if (idx === -1) return;

      const tbody = rowEl.closest("tbody");
      if (!tbody) return;

      const allRows = Array.from(tbody.querySelectorAll('tr[data-main-row="true"]')) as HTMLTableRowElement[];
      const rowIndex = allRows.indexOf(rowEl);
      const targetRowIndex = e.key === "ArrowDown" ? rowIndex + 1 : rowIndex - 1;
      const targetRowEl = allRows[targetRowIndex];

      if (targetRowEl) {
        const targetFocusables = Array.from(targetRowEl.querySelectorAll('input, button.font-jakarta-regular')) as HTMLElement[];
        if (targetFocusables[idx]) {
          targetFocusables[idx].focus();
        } else {
          targetRowEl.click();
          setTimeout(() => {
            const updatedFocusables = Array.from(targetRowEl.querySelectorAll('input, button.font-jakarta-regular')) as HTMLElement[];
            updatedFocusables[idx]?.focus();
          }, 100);
        }
      }
    }
  };

  return (
    <>
      <TableRow
        data-main-row="true"
        className={`cursor-pointer hover:bg-slate-50 border-b border-[#F3F4F6] ${isColored ? "bg-[#F9FAFB]" : "bg-white"}`}
        onClick={() => onRowClick()}
        onKeyDown={handleRowKeyDown}
      >
        <TableCell className="text-sm bg-inherit p-0 border-b border-[#F3F4F6]">
          {isEditing && isEditable ? (
            <div onClick={(e) => e.stopPropagation()} className="py-2 px-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between text-xs h-8 px-2 bg-white rounded-sm border-[#F3F4F6] font-normal hover:bg-white"
                  >
                    {row.date
                      ? parseLocalDate(row.date)
                          ?.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          .toLowerCase()
                          .replace(/ /g, "-")
                      : "Select Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={row.date ? parseLocalDate(row.date) : undefined}
                    captionLayout="dropdown"
                    startMonth={new Date(new Date().getFullYear() - 10, 0)}
                    endMonth={new Date(new Date().getFullYear() + 10, 11)}
                    onSelect={(date) => {
                      if (!date) return;
                      onFieldChange(row.id, "date", formatLocalDate(date));
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className="px-3 py-4 text-slate-700">{row.date}</div>
          )}
        </TableCell>
        <TableCell className="bg-inherit p-0 border-b border-[#F3F4F6] max-w-[160px] overflow-hidden">
          {isEditing && isEditable ? (
            <div onClick={(e) => e.stopPropagation()} className="py-2 px-1">
              <SearchableSelect
                trim
                value={row.projectId}
                options={projectOptions}
                disabled={loadingProjects}
                placeholder={loadingProjects ? "Loading..." : "Select project"}
                onChange={(val, opt) => {
                  onProjectChange(row.id, String(val), opt?.label ?? "");
                }}
                className="h-8 text-sm border-[#F3F4F6] rounded-sm"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-4 overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
              <span
                className="text-sm font-medium text-slate-700 truncate block"
                title={row.projectLabel}
              >
                {row.projectLabel}
              </span>
            </div>
          )}
        </TableCell>
        <TableCell className="text-sm bg-inherit p-0 border-b border-[#F3F4F6] max-w-[180px] overflow-hidden">
          {isEditing && isEditable ? (
            <div onClick={(e) => e.stopPropagation()} className="py-2 px-1">
              <SearchableSelect
                trim
                value={row.taskId}
                options={taskOptions}
                disabled={!row.projectId || loadingTasks}
                placeholder={
                  loadingTasks
                    ? "Loading..."
                    : !row.projectId
                      ? "Select project first"
                      : "Select task"
                }
                onChange={(val, opt) => {
                  onTaskChange(row.id, String(val), opt?.label ?? "");
                }}
                className="h-8 text-sm border-[#F3F4F6] rounded-sm"
              />
            </div>
          ) : (
            <div
              className="px-3 py-4 text-slate-600 truncate block"
              title={row.taskLabel}
            >
              {row.taskLabel}
            </div>
          )}
        </TableCell>
        <TableCell className="p-0 border-b border-[#F3F4F6] relative">
          {isEditing && isEditable ? (
            <div onClick={(e) => e.stopPropagation()} className="py-2 px-1 relative flex flex-col">
              <input
                type="text"
                value={row.hours}
                onChange={(e) => onFieldChange(row.id, "hours", e.target.value)}
                onBlur={(e) => {
                  const mins = parseHoursToMinutes(e.target.value);
                  if (mins > 0) {
                    onFieldChange(row.id, "hours", formatMinutesToXhYm(mins));
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const mins = parseHoursToMinutes((e.target as HTMLInputElement).value);
                    if (mins > 0) {
                      onFieldChange(row.id, "hours", formatMinutesToXhYm(mins));
                    }
                  }
                }}
                placeholder="0h 0m"
                className={`w-full h-8 px-2 border rounded-sm text-sm focus:outline-none focus:ring-1 bg-white ${
                  hasError
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-[#F3F4F6] focus:ring-primary focus:border-primary"
                }`}
              />
              {hasError && (
                <span className="absolute left-1 top-[40px] z-10 text-[9px] text-red-500 font-medium leading-tight whitespace-nowrap">
                  Daily total must be less than 24 hrs
                </span>
              )}
            </div>
          ) : (
            <div className="px-3 py-4 text-sm font-medium text-slate-700">
              {row.hours}
            </div>
          )}
        </TableCell>
        <TableCell className="p-0 border-b border-[#F3F4F6]">
          {isEditing && isEditable ? (
            <div onClick={(e) => e.stopPropagation()} className="py-2 px-1">
              <input
                type="text"
                placeholder="hh:mm"
                value={row.startTime}
                onChange={(e) =>
                  onFieldChange(row.id, "startTime", e.target.value)
                }
                onBlur={(e) => {
                  const normalized = normalizeToHHMM(e.target.value);
                  onFieldChange(row.id, "startTime", normalized);
                }}
                className="w-full h-8 px-2 border border-[#F3F4F6] rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              />
            </div>
          ) : (
            <div className="px-3 py-4 text-sm text-slate-600">
              {row.startTime}
            </div>
          )}
        </TableCell>
        <TableCell className="p-0 border-b border-[#F3F4F6]">
          {isEditing && isEditable ? (
            <div onClick={(e) => e.stopPropagation()} className="py-2 px-1">
              <input
                type="text"
                placeholder="hh:mm"
                value={row.endTime}
                onChange={(e) =>
                  onFieldChange(row.id, "endTime", e.target.value)
                }
                onBlur={(e) => {
                  const normalized = normalizeToHHMM(e.target.value);
                  onFieldChange(row.id, "endTime", normalized);
                }}
                className="w-full h-8 px-2 border border-[#F3F4F6] rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              />
            </div>
          ) : (
            <div className="px-3 py-4 text-sm text-slate-600">
              {row.endTime}
            </div>
          )}
        </TableCell>
        <TableCell className="p-0 border-b border-[#F3F4F6] relative">
          <div className="px-3 py-4 flex items-center justify-between">
            <TimesheetStatusBadge status={row.status} />
            {showDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteRow();
                }}
                className="text-slate-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow className="bg-muted/10" onClick={(e) => e.stopPropagation()}>
          <TableCell colSpan={7} className="py-4 border-b border-[#F3F4F6]">
            <div className="pl-4 pr-4">
              <label className="text-sm font-semibold text-slate-700 block mb-1">
                Description
              </label>
              {isEditing && isEditable ? (
                <textarea
                  value={row.description}
                  onChange={(e) =>
                    onFieldChange(row.id, "description", e.target.value)
                  }
                  className="w-full p-2 border border-[#F3F4F6] rounded-sm text-sm min-h-24 focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                  placeholder="Add description..."
                />
              ) : (
                <div className="text-sm text-slate-600 min-h-24 whitespace-pre-wrap p-2 border border-transparent">
                  {row.description || "No description provided."}
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
});
