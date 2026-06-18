"use client";

import { TrendingUp, DollarSign, Clock, Folder } from "lucide-react";

type MetricCardsProps = {
  totalHours: string;
  billableHours: string;
  billablePercentage: string;
  pendingApprovalsCount: number;
  activeProjectsCount: number;
};

export function TimesheetMetricCards({
  totalHours,
  billableHours,
  billablePercentage,
  pendingApprovalsCount,
  activeProjectsCount,
}: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {/* Total Hours This Week */}
      <div className="border border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to rounded-xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5 text-[#2563EB]" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-500">Total Hours This Week</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-slate-800">{totalHours}</span>
            <span className="text-xs text-slate-400">/ 40h</span>
          </div>
        </div>
      </div>

      {/* Billable Hours */}
      <div className="border border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to rounded-xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0">
          <DollarSign className="w-5 h-5 text-[#10B981]" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-500">Billable Hours</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl font-bold text-slate-800">{billableHours}</span>
            <span className="text-[10px] font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
              {billablePercentage}
            </span>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="border border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to rounded-xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#FFFBEB] flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5 text-[#D97706]" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-500">Pending Approvals</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-slate-800">{pendingApprovalsCount}</span>
            <span className="text-xs text-slate-400">entries</span>
          </div>
        </div>
      </div>

      {/* Projects Active */}
      <div className="border border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to rounded-xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#FAF5FF] flex items-center justify-center shrink-0">
          <Folder className="w-5 h-5 text-[#9333EA]" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-500">Projects Active</span>
          <span className="text-xl font-bold text-slate-800 mt-1">{activeProjectsCount}</span>
        </div>
      </div>
    </div>
  );
}
