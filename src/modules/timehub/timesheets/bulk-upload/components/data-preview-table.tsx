"use client";

import { useState, Fragment, useEffect } from "react";
import { Pencil, Check, Info, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Spinner } from "@/components/ui/spinner";

export type DataPreviewTableProps = {
  data?: any[];
  updateRow?: (index: number, newRow: any) => void;
  deleteRow?: (index: number) => void;
  userOptions?: { id: string; value: string; label: string }[];
  projectOptions?: { id: string; value: string; label: string }[];
  fetchTasks?: (projectId: string, userId: string) => void;
  taskCache?: React.MutableRefObject<Record<string, any[]>>;
  loadingTasksMap?: Record<string, boolean>;
  isValidating?: boolean;
};

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

export function DataPreviewTable({ 
  data, 
  updateRow,
  deleteRow,
  userOptions = [],
  projectOptions = [],
  fetchTasks,
  taskCache,
  loadingTasksMap = {},
  isValidating = false
}: DataPreviewTableProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setShowAll(false);
  }, [data?.length]);

  const rows = data && data.length > 0 
    ? data.map((d, index) => {
        const isError = !d.userValid || !d.projectValid || !d.taskValid || !d.Date;
        const cacheKey = d.projectId && d.userId ? `${d.projectId}_${d.userId}` : "";
        const cachedTasks = taskCache?.current?.[cacheKey] || [];
        const taskTitle = cachedTasks.find((t: any) => t.id === d.taskId)?.title;
        return {
          originalIndex: index,
          date: d["Date"] || "-",
          employee: userOptions.find(u => u.id === d.userId)?.label || d["Person"] || "Unknown",
          project: projectOptions.find(p => p.id === d.projectId)?.label || d["Project"] || "Project Missing",
          task: taskTitle || d["Task/Deliverable"] || "Task Missing",
          hours: `${d["Time in Hours"] || 0}h ${d["Time in Minutes"] ? d["Time in Minutes"] + "m" : ""}`,
          status: isError ? "Validation Error" : "Ready",
          isError: isError,
          hasProjectMissing: !d.projectValid,
          hasUserMissing: !d.userValid,
          hasTaskMissing: !d.taskValid,
        };
      })
    : [];

  const validCount = rows.filter((r) => !r.isError).length;
  const issueCount = rows.filter((r) => r.isError).length;

  return (
    <div className="border border-[#D9E7F2] rounded-md overflow-hidden bg-white mt-8">
      {/* Table Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-4 sm:px-6 sm:py-5 border-b border-[#D9E7F2] gap-2">
        <h3 className="text-sm sm:text-[15px] font-bold text-[#1a73e8] shrink-0">Data Preview & validation</h3>
        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-1.5 bg-[#F8FAFC] text-slate-600 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium tracking-tight whitespace-nowrap">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shrink-0" />
            {validCount} Valid Row{validCount !== 1 ? "s" : ""}
          </div>
          {issueCount > 0 && (
            <div className="flex items-center gap-1 sm:gap-1.5 bg-[#F8FAFC] text-slate-600 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium tracking-tight whitespace-nowrap">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] shrink-0" />
              {issueCount} Issue{issueCount !== 1 ? "s" : ""} Found
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className={`w-full overflow-x-auto ${editingIndex !== null ? "2xl:overflow-x-auto" : "2xl:overflow-x-hidden"}`}>
        <table className={`w-full text-left text-xs min-w-[900px] ${editingIndex !== null ? "2xl:min-w-[1000px]" : "2xl:min-w-0"}`}>
          <thead>
            <tr className="border-b border-[#D9E7F2] bg-[#F8FAFC]">
              <th className="px-4 py-2 font-semibold text-slate-700 text-[11px]">Date</th>
              <th className="px-4 py-2 font-semibold text-slate-700 text-[11px] w-[180px]">Employee</th>
              <th className="px-4 py-2 font-semibold text-slate-700 text-[11px] w-[200px]">Project</th>
              <th className="px-4 py-2 font-semibold text-slate-700 text-[11px] w-[200px]">Task</th>
              <th className="px-4 py-2 font-semibold text-slate-700 text-[11px] w-[140px]">Hours</th>
              <th className="px-4 py-2 font-semibold text-slate-700 text-[11px]">Status</th>
              <th className="px-4 py-2 font-semibold text-slate-700 text-[11px] text-right">Actions</th>
              <th className="px-4 py-2 w-[40px]"></th>
            </tr>
          </thead>
          <tbody>
            {isValidating ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-500 font-medium bg-white">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Spinner size={32} color="#1a73e8" />
                    <span className="text-sm font-semibold text-slate-600">Validating timesheet data...</span>
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500 font-medium">
                  No data available.
                </td>
              </tr>
            ) : (showAll ? rows : rows.slice(0, 5)).map((row) => {
                const i = row.originalIndex;
                const isEditing = editingIndex === i;
                const rawData = data?.[i];
                const cacheKey = rawData?.projectId && rawData?.userId ? `${rawData.projectId}_${rawData.userId}` : "";
                const rawTasks = taskCache?.current?.[cacheKey] || [];
                const taskOptions = rawTasks.map(t => ({ id: t.id, value: t.id, label: t.title }));
                const isLoadingTasks = loadingTasksMap[cacheKey] || false;

                return (
                  <Fragment key={i}>
                    <tr
                      className={`border-b border-[#D9E7F2] last:border-0 hover:bg-slate-50 transition-colors ${isEditing ? "bg-blue-50/30" : ""}`}
                    >
                      <td className="px-4 py-2.5 align-top">
                        {isEditing ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={`w-[110px] justify-between text-xs h-8 px-2 bg-white rounded-sm border-[#D9E7F2] ${
                                  !rawData?.Date ? "border-red-500" : ""
                                }`}
                              >
                                {rawData?.Date
                                  ? new Date(rawData.Date)
                                      .toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })
                                      .toLowerCase()
                                      .replace(/ /g, "-")
                                  : "Select Date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Calendar
                                mode="single"
                                selected={rawData?.Date ? parseLocalDate(rawData.Date) : undefined}
                                captionLayout="dropdown"
                                startMonth={new Date(new Date().getFullYear() - 10, 0)}
                                endMonth={new Date(new Date().getFullYear() + 10, 11)}
                                onSelect={(date) => {
                                  if (!date || !updateRow || !rawData) return;
                                  updateRow(i, { ...rawData, Date: formatLocalDate(date) });
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <div className="text-slate-600 font-medium pt-1 text-[11px]">
                            {row.date.split(", ").map((part: string, idx: number) => (
                              <div key={idx}>{part}</div>
                            ))}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-4 py-2.5 align-top">
                        {isEditing ? (
                          <div className={`w-full ${!rawData?.userValid ? "border border-red-500 rounded-sm" : ""}`}>
                            <SearchableSelect
                              value={rawData?.userId || ""}
                              options={userOptions}
                              onChange={(val) => {
                                if (!updateRow || !rawData) return;
                                const newUserId = val.toString();
                                updateRow(i, {
                                  ...rawData,
                                  userId: newUserId,
                                  userValid: true,
                                  taskId: "",
                                  taskValid: false,
                                });
                                if (rawData.projectId && fetchTasks) {
                                  fetchTasks(rawData.projectId, newUserId);
                                }
                              }}
                              placeholder="Select User"
                              desktopTrimLength={20}
                              className="h-8 text-xs border-[#D9E7F2] rounded-sm"
                            />
                          </div>
                        ) : (
                          <div className="pt-1">
                            {row.hasUserMissing ? (
                               <div className="inline-flex items-center gap-1.5 bg-[#FEF2F2] text-[#EF4444] px-2.5 py-1 rounded-full text-[10px] font-medium mb-1 whitespace-nowrap">
                                 <Info className="w-3 h-3" />
                                 User Missing
                               </div>
                            ) : (
                              <>
                                <div className="text-slate-800 font-semibold text-[11px]">{row.employee.split(" ")[0]}</div>
                                <div className="text-slate-800 font-semibold text-[11px]">{row.employee.split(" ").slice(1).join(" ")}</div>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-4 py-2.5 align-top">
                        {isEditing ? (
                          <div className={`w-full ${!rawData?.projectValid ? "border border-red-500 rounded-sm" : ""}`}>
                            <SearchableSelect
                              value={rawData?.projectId || ""}
                              options={projectOptions}
                              onChange={(val) => {
                                if (!updateRow || !rawData) return;
                                const newProjectId = val.toString();
                                updateRow(i, {
                                  ...rawData,
                                  projectId: newProjectId,
                                  projectValid: true,
                                  taskId: "",
                                  taskValid: false,
                                });
                                if (rawData.userId && fetchTasks) {
                                  fetchTasks(newProjectId, rawData.userId);
                                }
                              }}
                              placeholder="Select Project"
                              desktopTrimLength={25}
                              className="h-8 text-xs border-[#D9E7F2] rounded-sm"
                            />
                          </div>
                        ) : (
                          <div className="pt-1">
                            {row.hasProjectMissing ? (
                              <div className="inline-flex items-center gap-1.5 bg-[#FEF2F2] text-[#EF4444] px-2.5 py-1 rounded-full text-[10px] font-medium mb-1 whitespace-nowrap">
                                <Info className="w-3 h-3" />
                                Project Missing
                              </div>
                            ) : (
                              <div className="text-slate-600 font-medium text-[11px] whitespace-normal">
                                {row.project}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-4 py-2.5 align-top">
                        {isEditing ? (
                          <div className={`w-full ${!rawData?.taskValid ? "border border-red-500 rounded-sm" : ""}`}>
                            <SearchableSelect
                              value={rawData?.taskId || ""}
                              options={taskOptions}
                              onChange={(val) => {
                                if (!updateRow || !rawData) return;
                                updateRow(i, {
                                  ...rawData,
                                  taskId: val.toString(),
                                  taskValid: true,
                                });
                              }}
                              placeholder={
                                !rawData?.projectId
                                  ? "Select Project first"
                                  : isLoadingTasks
                                    ? "Loading tasks..."
                                    : "Select Task"
                              }
                              disabled={!rawData?.projectId || !rawData?.userId}
                              desktopTrimLength={25}
                              className="h-8 text-xs border-[#D9E7F2] rounded-sm"
                            />
                          </div>
                        ) : (
                          <div className="pt-1">
                            {row.hasTaskMissing ? (
                              <div className="inline-flex items-center gap-1.5 bg-[#FEF2F2] text-[#EF4444] px-2.5 py-1 rounded-full text-[10px] font-medium mb-1 whitespace-nowrap">
                                <Info className="w-3 h-3" />
                                Task Missing
                              </div>
                            ) : (
                              <div className="text-slate-600 font-medium text-[11px] whitespace-normal">
                                {row.task}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-4 py-2.5 align-top">
                        {isEditing ? (
                          <Input
                            type="number"
                            min={0}
                            placeholder="Mins"
                            value={
                              (Number(rawData?.["Time in Hours"]) || 0) * 60 +
                              (Number(rawData?.["Time in Minutes"]) || 0) || ""
                            }
                            onChange={(e) => {
                              if (!updateRow || !rawData) return;
                              const val = e.target.value === "" ? 0 : Number(e.target.value);
                              const h = Math.floor(val / 60);
                              const m = val % 60;
                              updateRow(i, {
                                ...rawData,
                                "Time in Hours": h,
                                "Time in Minutes": m,
                              });
                            }}
                            className="h-8 text-xs w-24 rounded-sm border-[#D9E7F2]"
                          />
                        ) : (
                          <div className="pt-1 text-slate-800 font-bold whitespace-normal text-[11px]">
                            {row.hours}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-4 py-2.5 align-top">
                        <div className="pt-1">
                          {row.isError ? (
                            <div className="inline-flex items-center gap-1.5 bg-[#FEF2F2] text-[#EF4444] px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                              {row.status}
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 bg-[#F0FDF4] text-[#22c55e] px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                              {row.status}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-4 py-2.5 text-right align-top">
                        <div className="pt-1 flex items-center justify-end">
                          {isEditing ? (
                            <button
                              onClick={() => setEditingIndex(null)}
                              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold text-[11px] transition-colors bg-blue-50 px-3 py-1.5 rounded-md"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Done
                            </button>
                          ) : (
                            <button 
                              onClick={() => setEditingIndex(i)}
                              className="inline-flex items-center gap-1.5 text-[#001e4b] hover:text-blue-600 font-semibold text-[11px] transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-4 py-2.5 text-center align-top w-[40px]">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => {
                              if (deleteRow) {
                                deleteRow(i);
                                if (editingIndex === i) {
                                  setEditingIndex(null);
                                }
                              }
                            }}
                            className="inline-flex items-center text-slate-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors shrink-0"
                            title="Delete Row"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isEditing && (
                      <tr className="bg-slate-50 border-b border-[#D9E7F2]">
                        <td colSpan={8} className="py-3 px-4">
                          <div className="w-full">
                            <label className="text-xs font-semibold text-slate-700 block mb-1">
                              Description / Notes
                            </label>
                            <textarea
                              value={rawData?.["Additional Notes"] || ""}
                              onChange={(e) => {
                                if (!updateRow || !rawData) return;
                                updateRow(i, { ...rawData, "Additional Notes": e.target.value });
                              }}
                              className="w-full p-2 border border-[#D9E7F2] rounded-sm text-xs min-h-[80px] focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                              placeholder="Add additional notes..."
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            }
          </tbody>
        </table>
      </div>

      {/* Footer / Load More */}
      {rows.length > 5 && !showAll && (
        <div className="bg-[#F8FAFC] py-4 text-center border-t border-[#D9E7F2]">
          <button
            onClick={() => setShowAll(true)}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 tracking-wide uppercase transition-colors"
          >
            LOAD MORE ROWS
          </button>
        </div>
      )}
    </div>
  );
}
