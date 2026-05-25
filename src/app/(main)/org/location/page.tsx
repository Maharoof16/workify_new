"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table";
import { buildColumns } from "@/lib/table-utils";
import { useMemo, useState } from "react";
import departmentImg from "@/assets/Attendance.png";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { MoveRight, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

type LocationStatus = "ACTIVE" | "INACTIVE";

type Location = {
  id: number;
  name: string;
  address: string;
  timezone: string;
  createdAt: string;
  status: LocationStatus;
};

export default function DepartmentsPage() {
  const router = useRouter();

  const [loading] = useState(false);

  const [locations, setLocations] = useState<Location[]>([
    {
      id: 1,
      name: "Hyderabad HQ",
      address: "Madhapur, Hyderabad",
      timezone: "Asia/Kolkata",
      createdAt: "01 May 2026",
      status: "ACTIVE",
    },
    {
      id: 2,
      name: "Bangalore Office",
      address: "Whitefield, Bangalore",
      timezone: "Asia/Kolkata",
      createdAt: "03 May 2026",
      status: "ACTIVE",
    },
    {
      id: 3,
      name: "Chennai Branch",
      address: "OMR, Chennai",
      timezone: "Asia/Kolkata",
      createdAt: "08 May 2026",
      status: "INACTIVE",
    },
    {
      id: 4,
      name: "Mumbai Hub",
      address: "Andheri East, Mumbai",
      timezone: "Asia/Kolkata",
      createdAt: "12 May 2026",
      status: "ACTIVE",
    },
  ]);

  const headers = [
    "Location Name",
    "Address",
    "Timezone",
    "Created Date",
    "Status",
    // "Actions",
  ];

  const columns = useMemo(() => {
    return buildColumns<Location>({
      headers,

      customRenderers: {
        "Location Name": {
          cell: (item) => <span className="font-medium">{item.name}</span>,
        },

        Address: {
          cell: (item) => (
            <span className="text-sm text-muted-foreground">
              {item.address}
            </span>
          ),
        },

        Timezone: {
          cell: (item) => <span className="text-sm">{item.timezone}</span>,
        },

        "Created Date": {
          cell: (item) => item.createdAt,
        },

        Status: {
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

        // Actions: {
        //   cell: (item) => {
        //     return (
        //       <div className="flex items-center gap-2">
        //         <Badge
        //           className="cursor-pointer status-info"
        //           onClick={() => router.push(`/location/${item.id}`)}
        //         >
        //           <Pencil className="w-3.5 h-3.5" />
        //           Modify
        //         </Badge>
        //       </div>
        //     );
        //   },
        // },
      },
    });
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Locations</h1>
        </div>
        {/* <Button
      onClick={() => router.push("/org/location/create")}
      className="h-10 px-5 flex items-center gap-2"
    >
      Create Location
      <MoveRight className="h-4 w-4" />
    </Button> */}
      </div>

      <div className="border border-dashboard-border rounded-xl bg-linear-to-b from-dashboard-card-from to-dashboard-card-to overflow-hidden">
        <div className="grid grid-cols-12 gap-6 p-5">
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-5">
            <div className="space-y-3">
              <Badge className="status-info w-fit px-3 py-1">
                Office Management
              </Badge>

              <h2 className="text-[28px] leading-tight font-bold max-w-xl">
                Easily Manage Multi-Location Workspaces
              </h2>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                Create office locations, maintain addresses, assign timezones,
                and organize employees efficiently across branches.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-dashboard-border bg-background/50 p-4">
                <p className="text-sm text-muted-foreground">Total Locations</p>

                <h3 className="text-2xl font-bold mt-2">{locations.length}</h3>
              </div>

              <div className="rounded-lg border border-dashboard-border bg-background/50 p-4">
                <p className="text-sm text-muted-foreground">Active</p>

                <h3 className="text-2xl font-bold mt-2 text-green-600">
                  {locations.filter((item) => item.status === "ACTIVE").length}
                </h3>
              </div>

              <div className="rounded-lg border border-dashboard-border bg-background/50 p-4">
                <p className="text-sm text-muted-foreground">Inactive</p>

                <h3 className="text-2xl font-bold mt-2 text-red-500">
                  {
                    locations.filter((item) => item.status === "INACTIVE")
                      .length
                  }
                </h3>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 flex items-center justify-center lg:justify-end">
            <Image
              src={departmentImg}
              alt="Location"
              className="
            w-full
            max-w-[360px]
            lg:max-w-[420px]
            h-auto
            object-contain
          "
            />
          </div>
        </div>
      </div>

      <div
        className="
      border border-dashboard-border
      rounded-xl
      bg-linear-to-b
      from-dashboard-card-from
      to-dashboard-card-to
      p-4 space-y-4
    "
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-semibold">Location History</h2>

            <p className="text-sm text-muted-foreground mt-1">
              View and manage all created office locations.
            </p>
          </div>
        </div>

        <DataTable
          name="locationTable"
          data={locations}
          columns={columns}
          loading={loading}
          visibilityToggle={false}
        />
      </div>
    </div>
  );
}
