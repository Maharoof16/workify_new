"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table";
import { buildColumns } from "@/lib/table-utils";
import { useMemo, useState } from "react";
import departmentImg from "@/assets/Leave-Banner.png";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { MoveRight, Pencil, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type DepartmentStatus = "ACTIVE" | "INACTIVE";

type Department = {
  id: number;
  department: string;
  createdAt: string;
  status: DepartmentStatus;
};

export default function DepartmentsPage() {
  const router = useRouter();

  const [loading] = useState(false);

  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 1,
      department: "Engineering",
      createdAt: "01 May 2026",
      status: "ACTIVE",
    },
    {
      id: 2,
      department: "Human Resources",
      createdAt: "03 May 2026",
      status: "ACTIVE",
    },
    {
      id: 3,
      department: "Finance",
      createdAt: "08 May 2026",
      status: "INACTIVE",
    },
    {
      id: 4,
      department: "Marketing",
      createdAt: "12 May 2026",
      status: "ACTIVE",
    },
  ]);

  const headers = [
    "Department",
    "Created Date",
    "Department Status",
    "Actions",
  ];

  const columns = useMemo(() => {
    return buildColumns<Department>({
      headers,

      customRenderers: {
        Department: {
          cell: (item) => (
            <span className="font-medium">{item.department}</span>
          ),
        },

        "Created Date": {
          cell: (item) => item.createdAt,
        },

        "Department Status": {
          cell: (item) => (
            <Badge
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md",
                item.status === "ACTIVE" ? "status-success" : "status-danger",
              )}
            >
              {item.status}
            </Badge>
          ),
        },

        Actions: {
          cell: (item) => {
            return (
              <div className="flex items-center gap-2">
                <Badge
                  className="cursor-pointer status-info"
                  onClick={() => router.push(`department/${item.id}`)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Modify
                </Badge>
              </div>
            );
          },
        },
      },
    });
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Departments</h1>
      <div className="grid grid-cols-12 gap-3 items-stretch">
        <div className="col-span-12 lg:col-span-8 border border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to rounded-xl p-4">
          <div className="grid xl:grid-cols-12 gap-4 h-full">
            <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-[24px] font-semibold">
                  {" "}
                  Organize Departments Easily
                </h2>
                <p className="text-[15px] leading-tight">
                  Create and manage departments centrally. Users can later be
                  assigned to departments during employee creation.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => router.push("/org/department/create")}
                  className="w-45 flex items-center text-[14px] justify-center gap-2 py-5"
                >
                  Create Department
                  <MoveRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6 flex justify-center md:justify-end">
              <Image
                src={departmentImg}
                alt="Department"
                className="w-full max-w-[420px] lg:max-w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="grid grid-cols-1 gap-3 h-full">
            <div className="border border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">
                    Total Departments
                  </p>

                  <h2 className="text-3xl font-bold">{departments.length}</h2>
                </div>
                <div className="rounded-full p-3 bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>

            <div
              className="border border-dashboard-border
              bg-linear-to-b
              from-dashboard-card-from
              to-dashboard-card-to
              rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">
                    Active Departments
                  </p>

                  <h2 className="text-3xl font-bold mt-2 text-green-600">
                    {
                      departments.filter((item) => item.status === "ACTIVE")
                        .length
                    }
                  </h2>
                </div>
                <Badge className="status-success px-3 py-1">ACTIVE</Badge>
              </div>
            </div>
            <div className="border border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">
                    Inactive Departments
                  </p>
                  <h2 className="text-3xl font-bold mt-2 text-red-500">
                    {
                      departments.filter((item) => item.status === "INACTIVE")
                        .length
                    }
                  </h2>
                </div>
                <Badge className="status-danger px-3 py-1">INACTIVE</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3 border border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to rounded-xl p-4">
        <h2 className="text-[18px] font-semibold">Department History</h2>
        <DataTable
          name="departmentTable"
          data={departments}
          columns={columns}
          loading={loading}
          visibilityToggle={false}
        />
      </div>
    </div>
  );
}
