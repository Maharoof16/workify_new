"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, AlertCircle, HelpCircle } from "lucide-react";

type Props = {
  status?: string | null;
};

export function TimesheetStatusBadge({ status }: Props) {
  if (!status) return null;

  const normalized = status.toUpperCase();

  const getStyles = () => {
    switch (normalized) {
      case "APPROVED":
        return {
          className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50",
          label: "Approved",
          Icon: CheckCircle2,
        };

      case "REJECTED":
        return {
          className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
          label: "Rejected",
          Icon: XCircle,
        };

      case "PARTIALLY_APPROVED":
        return {
          className: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50",
          label: "Partially Approved",
          Icon: AlertCircle,
        };

      case "PARTIALLY_REJECTED":
        return {
          className: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50",
          label: "Partially Rejected",
          Icon: AlertCircle,
        };

      case "PENDING":
      case "SUBMITTED":
        return {
          className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
          label: "Pending",
          Icon: Clock,
        };

      case "READY":
        return {
          className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
          label: "Ready",
          Icon: CheckCircle2,
        };

      case "VALIDATION_ERROR":
        return {
          className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
          label: "Validation Error",
          Icon: XCircle,
        };

      case "PROJECT_MISSING":
        return {
          className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
          label: "Project Missing",
          Icon: AlertCircle,
        };

      default:
        return {
          className: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-50",
          label: normalized,
          Icon: HelpCircle,
        };
    }
  };

  const { className, label, Icon } = getStyles();

  return (
    <Badge 
      variant="outline" 
      className={`rounded-full px-1.5 py-0.5 lg:px-2.5 lg:py-0.5 text-[9px] lg:text-[13px] font-medium border flex items-center gap-1 lg:gap-1.5 shadow-none shrink-0 ${className}`}
    >
      <Icon className="w-3 h-3 lg:w-3.5 lg:h-3.5 shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </Badge>
  );
}
