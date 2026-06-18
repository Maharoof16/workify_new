"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Download, X, FileText, Files } from "lucide-react";
import { TimesheetFormLayout } from "@/modules/timehub/timesheets/components/timesheet-form-layout";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { UploadZone } from "@/modules/timehub/timesheets/bulk-upload/components/upload-zone";
import { DataPreviewTable } from "@/modules/timehub/timesheets/bulk-upload/components/data-preview-table";
import { toast } from "sonner";
import { ProjectService } from "@/modules/my-org/projects/project.service";
import { TaskService } from "@/modules/my-org/tasks/task.service";
import { TimesheetService } from "@/modules/timehub/timesheets/timesheet.service";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { Reference } from "@/modules/my-org/organization";
import type { TaskReferenceList } from "@/modules/my-org/tasks/task";
import type { userReference } from "@/modules/members/users/users";


export type TimesheetRow = Record<string, any>;

const formatExcelDate = (excelDate: any): string => {
  if (!excelDate) return "";
  
  if (typeof excelDate === "number") {
    try {
      const d = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
      if (!isNaN(d.getTime())) {
        return d.toISOString().split("T")[0];
      }
    } catch (_) {}
  }
  
  if (excelDate instanceof Date) {
    try {
      if (!isNaN(excelDate.getTime())) {
        return excelDate.toISOString().split("T")[0];
      }
    } catch (_) {}
  }
  
  if (typeof excelDate === 'object' && excelDate !== null) {
    if (excelDate.result) {
      return formatExcelDate(excelDate.result);
    }
  }
  
  const dateStr = String(excelDate).trim();
  if (!dateStr) return "";
  
  // Try standard Date parsing
  let d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split("T")[0];
  }
  
  // Try DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const parts = dateStr.split(/[-/.]/);
  if (parts.length === 3) {
    const p0 = parseInt(parts[0], 10);
    const p1 = parseInt(parts[1], 10);
    const p2 = parseInt(parts[2], 10);
    
    // YYYY-MM-DD
    if (p0 > 1000 && p1 >= 1 && p1 <= 12 && p2 >= 1 && p2 <= 31) {
      d = new Date(p0, p1 - 1, p2);
      if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
    }
    
    // DD-MM-YYYY
    if (p2 > 1000 && p1 >= 1 && p1 <= 12 && p0 >= 1 && p0 <= 31) {
      d = new Date(p2, p1 - 1, p0);
      if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
    }
  }
  
  return dateStr;
};

// Fuzzy match helper
const normalizeString = (str: string) => str?.toLowerCase().replace(/\s+/g, " ").trim() || "";

export default function BulkUploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [parsedData, setParsedData] = useState<TimesheetRow[]>([]);
  const [validatedData, setValidatedData] = useState<TimesheetRow[]>([]);
  const [step, setStep] = useState<"upload" | "preview">("upload");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // References
  const userId = useSelector((state: RootState) => state.auth.userData?.id);
  const [projects, setProjects] = useState<Reference[]>([]);
  const [users, setUsers] = useState<userReference[]>([]);
  
  const [loadingTasksMap, setLoadingTasksMap] = useState<Record<string, boolean>>({});
  const taskCache = useRef<Record<string, TaskReferenceList[]>>({});

  useEffect(() => {
    const fetchRefs = async () => {
      try {
        const [projectsRes, usersRes] = await Promise.all([
          ProjectService.getReferenceList(),
          ProjectService.getUserList(),
        ]);
        setProjects(projectsRes);
        setUsers(usersRes as unknown as userReference[]);
      } catch (err) {
        console.error("Failed to load references", err);
      }
    };
    fetchRefs();
  }, []);

  const fetchTasks = useCallback(async (projectId: string, assigneeId?: string) => {
    if (!projectId || !assigneeId) return;
    const cacheKey = `${projectId}_${assigneeId}`;
    if (taskCache.current[cacheKey]) return taskCache.current[cacheKey];

    try {
      setLoadingTasksMap(p => ({ ...p, [cacheKey]: true }));
      const taskData = await TaskService.getReferenceList(projectId, assigneeId);
      taskCache.current[cacheKey] = taskData;
      return taskData;
    } catch (error) {
      console.error("Failed to fetch tasks", error);
      return [];
    } finally {
      setLoadingTasksMap(p => ({ ...p, [cacheKey]: false }));
    }
  }, []);

  const userOptions = users.map((u) => ({
    id: u.id,
    value: u.id,
    label: u.name || `${(u as any).firstName || ""} ${(u as any).lastName || ""}`.trim(),
  }));

  const projectOptions = projects.map((p) => ({
    id: p.id,
    value: p.id,
    label: p.name,
  }));

  const REQUIRED_HEADERS = [
    "date",
    "person",
    "project",
    "task/deliverable",
    "additional notes",
    "time in hours",
    "time in minutes",
  ];

  const reset = () => {
    setFile(null);
    setParsedData([]);
    setValidatedData([]);
    setIsValid(false);
    setStep("upload");
  };

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);

    try {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      const buffer = await selectedFile.arrayBuffer();
      await workbook.xlsx.load(buffer);
      const worksheet = workbook.worksheets[0];

      if (!worksheet) {
        toast.error("No sheet found in file");
        reset();
        return;
      }

      const headerRow = worksheet.getRow(1);
      const headers = (headerRow.values as string[]).slice(1);
      const cleanedHeaders = headers.map((h) => normalizeString(String(h)));

      const missing = REQUIRED_HEADERS.filter((h) => !cleanedHeaders.includes(h));

      if (missing.length > 0) {
        toast.error(`Missing headers: ${missing.join(", ")}`);
        reset();
        return;
      }

      const data: TimesheetRow[] = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // skip header

        const rowData: any = {};
        cleanedHeaders.forEach((header, index) => {
          const value = row.getCell(index + 1).value;
          switch (header) {
            case "date": rowData["Date"] = formatExcelDate(value); break;
            case "person": rowData["Person"] = String(value ?? ""); break;
            case "project": rowData["Project"] = String(value ?? ""); break;
            case "task/deliverable": rowData["Task/Deliverable"] = String(value ?? ""); break;
            case "additional notes": rowData["Additional Notes"] = String(value ?? ""); break;
            case "time in hours": rowData["Time in Hours"] = Number(value) || 0; break;
            case "time in minutes": rowData["Time in Minutes"] = Number(value) || 0; break;
            default: break;
          }
        });
        
        const isEmpty = [
          rowData["Date"], rowData["Person"], rowData["Project"],
          rowData["Task/Deliverable"], rowData["Additional Notes"],
          rowData["Time in Hours"], rowData["Time in Minutes"],
        ].every((val) => {
          if (typeof val === "number") return val === 0;
          return !val || String(val).trim() === "";
        });

        const rawHours = Number(rowData["Time in Hours"]) || 0;
        const rawMinutes = Number(rowData["Time in Minutes"]) || 0;
        const totalMinutes = rawHours * 60 + rawMinutes;
        rowData["Time in Hours"] = Math.floor(totalMinutes / 60);
        rowData["Time in Minutes"] = totalMinutes % 60;

        if (!isEmpty) data.push(rowData);
      });

      const hasValidRow = data.some((row) => {
        return (
          row["Date"] || row["Person"] || row["Project"] ||
          row["Task/Deliverable"] || row["Additional Notes"] ||
          Number(row["Time in Hours"]) > 0 || Number(row["Time in Minutes"]) > 0
        );
      });

      if (!hasValidRow) {
        toast.error("No valid records found.");
        reset();
        return;
      }

      setParsedData(data);
      setIsValid(true);
      toast.success(`File parsed successfully. Click Validate Data to proceed.`);
    } catch (err) {
      console.error(err);
      toast.error("Invalid file. Please upload a proper Excel file.");
      reset();
    }
  };

  const handleValidateData = async () => {
    setIsValidating(true);
    try {
      // Process parsedData into validatedData
      const mapped = await Promise.all(parsedData.map(async (row) => {
        const personStr = normalizeString(row["Person"]);
        const matchedUser = userOptions.find(u => normalizeString(u.label) === personStr);
        
        const projectStr = normalizeString(row["Project"]);
        const matchedProject = projectOptions.find(p => normalizeString(p.label) === projectStr);
        
        let matchedTask = null;
        if (matchedProject && matchedUser) {
          const tasks = await fetchTasks(matchedProject.id, matchedUser.id);
          const taskStr = normalizeString(row["Task/Deliverable"]);
          matchedTask = tasks?.find(t => normalizeString(t.title) === taskStr);
        }

        return {
          ...row,
          userId: matchedUser?.id || "",
          userValid: !!matchedUser,
          projectId: matchedProject?.id || "",
          projectValid: !!matchedProject,
          taskId: matchedTask?.id || "",
          taskValid: !!matchedTask,
        };
      }));

      setValidatedData(mapped);
      setStep("preview");
      router.push("/timehub/timesheet/bulk-upload?step=preview");
    } catch (err) {
      console.error(err);
      toast.error("Failed to validate data");
    } finally {
      setIsValidating(false);
    }
  };

  const updateRow = (index: number, newRow: TimesheetRow) => {
    const newData = [...validatedData];
    newData[index] = newRow;
    setValidatedData(newData);
  };

  const deleteRow = (index: number) => {
    const newParsed = parsedData.filter((_, idx) => idx !== index);
    const newValidated = validatedData.filter((_, idx) => idx !== index);
    setParsedData(newParsed);
    setValidatedData(newValidated);
    toast.success("Record deleted successfully");
  };

  const isTableValid = validatedData.length > 0 && validatedData.every(row => 
    row.userValid && row.projectValid && row.userId && row.projectId && row.taskId && row.Date
  );

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const time_entries = validatedData.map((r) => {
        const totalMinutes = (Number(r["Time in Hours"]) || 0) * 60 + (Number(r["Time in Minutes"]) || 0);
        let dateStr = "";
        if (r.Date) {
          if (/^\d{4}-\d{2}-\d{2}$/.test(r.Date)) {
            dateStr = r.Date;
          } else {
            dateStr = formatExcelDate(r.Date);
          }
        }
        if (!dateStr || dateStr === "Invalid Date" || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          dateStr = new Date().toISOString().split('T')[0];
        }
        
        const [y, m, d] = dateStr.split("-").map(Number);
        const start = new Date(y, m - 1, d, 9, 0, 0);
        const end = new Date(start.getTime() + totalMinutes * 60000);

        return {
          entryDate: dateStr,
          projectId: r.projectId,
          taskId: r.taskId,
          memberId: r.userId,
          description: r["Additional Notes"] || "",
          startAt: start.toISOString(),
          endAt: end.toISOString(),
        };
      });

      await TimesheetService.createMultipleEntries({ time_entries });
      toast.success("Timesheets successfully uploaded!");
      router.push("/timehub/timesheet");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit timesheets");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFile = () => {
    reset();
    router.push("/timehub/timesheet/bulk-upload");
  };

  const exportTimesheetTemplate = async () => {
    try {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Timesheet Template");

      worksheet.columns = [
        { header: "Date", key: "date", width: 20 },
        { header: "Person", key: "person", width: 25 },
        { header: "Project", key: "project", width: 25 },
        { header: "Task/Deliverable", key: "task", width: 30 },
        { header: "Additional Notes", key: "notes", width: 40 },
        { header: "Time in Hours", key: "hours", width: 20 },
        { header: "Time in Minutes", key: "minutes", width: 20 },
      ];

      const totalRows = 400;
      for (let i = 2; i <= totalRows + 1; i++) {
        worksheet.getRow(i).values = ["", "", "", "", "", "", ""];
        worksheet.getCell(`G${i}`).dataValidation = {
          type: "whole",
          operator: "greaterThan",
          formulae: ["0"],
          showErrorMessage: true,
          errorTitle: "Invalid Minutes",
          error: "Minutes must be greater than 0",
        };
      }

      worksheet.getRow(1).font = { bold: true };
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Timesheet_Template.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate template", error);
    }
  };

  return (
    <TimesheetFormLayout>
            <div className="px-4 pt-4 pb-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Bulk Import Timesheet
              </h1>
              <p className="text-sm text-slate-500 mt-2">
                Streamline project logs by uploading your architectural drafting hours in bulk.
              </p>
            </div>

            <div className="px-4 flex">
              <button
                type="button"
                onClick={() => router.push("/timehub/timesheet/add-work-entry")}
                className="flex items-center gap-2 py-2.5 px-5 text-sm font-semibold border-b-4 transition-colors border-[#D9E7F2] text-[#6B7280] hover:text-[#4B5563]"
              >
                <FileText className="w-4 h-4" />
                Manual Entry
              </button>
              <button
                type="button"
                className="flex items-center gap-2 py-2.5 px-5 text-sm font-semibold border-b-4 transition-colors border-[#1482DD] text-[#1482DD]"
              >
                <Files className="w-4 h-4" />
                Bulk Upload
              </button>
            </div>

            <div className="px-4 pb-4">
              <div className="border border-[#D9E7F2] rounded-md rounded-tl-none p-4 space-y-4 bg-transparent">
                
                {/* Upload Section */}
                <div>
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <h3 className="text-xs sm:text-[15px] font-semibold text-blue-600 shrink-0">Upload Files</h3>
                    <button onClick={exportTimesheetTemplate} className="flex items-center gap-1 border border-blue-500 rounded-md px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-blue-500 hover:bg-blue-50 transition-colors shrink-0">
                      <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      Bulk Upload Template
                    </button>
                  </div>
                  
                  <UploadZone 
                    file={file}
                    onFileProcess={processFile}
                    onRemoveFile={handleRemoveFile}
                  />
                </div>

                {/* Table Section */}
                <div className="w-full">
                  <DataPreviewTable 
                    data={validatedData}
                    updateRow={updateRow}
                    deleteRow={deleteRow}
                    userOptions={userOptions}
                    projectOptions={projectOptions}
                    fetchTasks={fetchTasks}
                    taskCache={taskCache}
                    loadingTasksMap={loadingTasksMap}
                    isValidating={isValidating}
                  />

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 gap-1 sm:gap-2">
                    <div className="flex items-center gap-1 sm:gap-2 xl:gap-3">
                      <Button
                        type="button"
                        onClick={handleValidateData}
                        disabled={isValidating || parsedData.length === 0}
                        variant="outline"
                        className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-md px-2 py-1 sm:px-4 sm:py-1.5 xl:px-8 xl:py-2 text-[10px] sm:text-xs xl:text-sm font-semibold h-7 sm:h-8 xl:h-10 flex items-center justify-center shrink-0"
                      >
                        {isValidating ? (
                          <div className="flex items-center gap-1.5">
                            <Spinner size={14} color="#2563eb" />
                            <span>Validating...</span>
                          </div>
                        ) : (
                          "Validate Data"
                        )}
                      </Button>
                      
                      <Button
                        onClick={handleSubmit}
                        disabled={!isTableValid || isSubmitting}
                        className="bg-[#1a73e8] hover:bg-blue-700 text-white rounded-md px-2 py-1 sm:px-4 sm:py-1.5 xl:px-8 xl:py-2 text-[10px] sm:text-xs xl:text-sm font-semibold h-7 sm:h-8 xl:h-10 shadow-sm flex items-center justify-center shrink-0"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Report →"}
                      </Button>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-[10px] sm:text-xs xl:text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors px-1 sm:px-2 xl:px-4 shrink-0"
                    >
                      Cancel Import
                    </button>
                  </div>
                </div>

              </div>
            </div>
    </TimesheetFormLayout>
  );
}
