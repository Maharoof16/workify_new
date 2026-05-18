"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table";
import { buildColumns } from "@/lib/table-utils";
import { useMemo } from "react";
import leaveImg from "@/assets/Leave-Banner.png"; // replace later
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { MoveRight, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { LeaveBalanceCard } from "@/modules/timehub/leaves/components/leave-card";

type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

type Leave = {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  duration: string;
  status: LeaveStatus;
};

const leaveData: Leave[] = [
  {
    id: "1",
    type: "Sick",
    startDate: "2026-04-12",
    endDate: "2026-04-15",
    reason: "Viral Fever",
    duration: "4 Days",
    status: "PENDING",
  },
  {
    id: "2",
    type: "Paid",
    startDate: "2026-04-22",
    endDate: "2026-04-22",
    reason: "Family Function",
    duration: "1 Day",
    status: "APPROVED",
  },
  {
    id: "1",
    type: "Sick",
    startDate: "2026-04-12",
    endDate: "2026-04-15",
    reason: "Viral Fever",
    duration: "4 Days",
    status: "PENDING",
  },
  {
    id: "2",
    type: "Paid",
    startDate: "2026-04-22",
    endDate: "2026-04-22",
    reason: "Family Function",
    duration: "1 Day",
    status: "APPROVED",
  },
  {
    id: "1",
    type: "Sick",
    startDate: "2026-04-12",
    endDate: "2026-04-15",
    reason: "Viral Fever",
    duration: "4 Days",
    status: "PENDING",
  },
  {
    id: "2",
    type: "Paid",
    startDate: "2026-04-22",
    endDate: "2026-04-22",
    reason: "Family Function",
    duration: "1 Day",
    status: "APPROVED",
  },
  {
    id: "1",
    type: "Sick",
    startDate: "2026-04-12",
    endDate: "2026-04-15",
    reason: "Viral Fever",
    duration: "4 Days",
    status: "PENDING",
  },
  {
    id: "2",
    type: "Paid",
    startDate: "2026-04-22",
    endDate: "2026-04-22",
    reason: "Family Function",
    duration: "1 Day",
    status: "APPROVED",
  },
];

const StatusBadge = ({ status }: { status: LeaveStatus }) => {
  const map = {
    PENDING: "status-warning",
    APPROVED: "status-success",
    REJECTED: "status-danger",
  };

  return (
    <span
      className={cn("px-2 py-1 rounded-md text-xs font-medium", map[status])}
    >
      {status}
    </span>
  );
};

export default function LeavesPage() {
  const columns = useMemo(() => {
    return buildColumns<Leave>({
      headers: [
        "Leave Type",
        "Start Date",
        "End Date",
        "Reason",
        "Duration",
        "Leave Status",
        "Actions",
      ],
      customRenderers: {
        "Leave Type": {
          cell: (item) => (
            <span className="text-sm font-medium">{item.type}</span>
          ),
        },

        "Leave Status": {
          cell: (item) => <StatusBadge status={item.status} />,
        },
        Actions: {
          cell: () => {
            return (
              <div className="flex items-center gap-2">
                <Badge
                  className="cursor-pointer status-info"
                  onClick={() => router.push("/timehub/leaves/modify")}
                >
                  <Pencil />
                  Modify
                </Badge>
              </div>
            );
          },
        },
      },
    });
  }, []);
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 p-2 ">
      <h1 className="text-2xl font-bold">Leaves</h1>

      <div className="grid grid-cols-12 gap-3 items-stretch">
        <div
          className="col-span-12 lg:col-span-8 border border-dashboard-border
  bg-linear-to-b
  from-dashboard-card-from
  to-dashboard-card-to rounded-xl  p-4"
        >
          <div className="grid xl:grid-cols-12 gap-4 h-full">
            <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-[24px] font-semibold">Need A Break ?</h2>
                <p className="text-[15px] leading-tight">
                  Submit a Leave request in just few clicks and get approved in
                  seconds.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => router.push("/timehub/leaves/apply")}
                  className="w-40 flex items-center text-[14px] justify-center gap-2 py-5"
                >
                  Apply Leave
                  <MoveRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push("/timehub/leaves/comp-off")}
                  className="w-40 py-5 text-[14px]"
                >
                  Comp-Off
                </Button>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6 flex justify-center md:justify-end">
              <Image
                src={leaveImg}
                alt="Leave"
                className="
            w-full
            max-w-[420px]
            lg:max-w-full
            h-auto
            object-contain
          "
              />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="h-full">
            <LeaveBalanceCard />
          </div>
        </div>
      </div>

      <div
        className=" space-y-3 border border-dashboard-border
  bg-linear-to-b
  from-dashboard-card-from
  to-dashboard-card-to rounded-xl  p-4"
      >
        <h2 className="text-[18px] font-semibold">Leave History</h2>

        <DataTable
          name="leaveTable"
          data={leaveData}
          columns={columns}
          loading={false}
          visibilityToggle={false}
        />
      </div>
    </div>
  );
}
