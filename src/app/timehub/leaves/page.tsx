"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table";
import { buildColumns } from "@/lib/table-utils";
import { useMemo } from "react";
import leaveImg from "@/assets/Leave-Banner.png"; // replace later
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { LeaveBalanceCard } from "@/components/leaves/leave-card";

// ================= TYPES =================
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

// ================= MOCK DATA =================
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
];

const StatusBadge = ({ status }: { status: LeaveStatus }) => {
  const map = {
    PENDING: "status-warning",
    APPROVED: "status-success",
    REJECTED: "status-danger",
  };

  return (
    <span
      className={cn(
        "px-2 py-1 rounded-md text-xs font-medium",
        map[status]
      )}
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

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3">
        <div className="border rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">Need A Break ?</h2>
                <p className="text-sm text-muted-foreground">
                  Submit a Leave request in just few clicks and get approved in
                  seconds.
                </p>
              </div>

              <div className="flex flex-col gap-3 w-4/12">
                <Button onClick={() => router.push("/timehub/leaves/apply")}>
                  Apply Leave →
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/timehub/leaves/comp-off")}
                >
                  Comp-Off
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Image
                src={leaveImg}
                alt="Leave"
                className="w-full lg:w-10/12 lg:h-64  xl:h-auto object-fit"
              />
            </div>
          </div>
        </div>

        <div>
          <LeaveBalanceCard />
        </div>
      </div>

      <div className="border rounded-xl p-4 space-y-3">
        <h2 className="text-sm font-medium ">Leave History</h2>

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
