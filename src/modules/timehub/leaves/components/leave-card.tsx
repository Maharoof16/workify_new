"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { LeaveBalance } from "../leave";
import { LeaveService } from "../leave.service";
import { getLeaveTheme } from "../leave.constant";
import { ArrowRight, MoveRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function getProgress(used: number, total: number) {
  if (!total) return 0;

  return Math.min(Math.round((used / total) * 100), 100);
}

type Variant = "grid" | "stack" | "dashboard";

export function LeaveBalanceCard({ variant = "grid" }: { variant?: Variant }) {
  const isGrid = variant === "grid";
  const isStack = variant === "stack";
  const isDashboard = variant === "dashboard";
  const router = useRouter();
  const [leaveData, setLeaveData] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveBalances();
  }, []);

  const fetchLeaveBalances = async () => {
    try {
      const res = await LeaveService.getLeaveBalance();

      setLeaveData(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
          w-full h-full
          border border-dashboard-border
          bg-linear-to-b
          from-dashboard-card-from
          to-dashboard-card-to rounded-xl  p-0
        ${
          isDashboard
            ? "rounded-xl py-3 px-4 flex flex-col gap-5"
            : isGrid
              ? "rounded-xl p-4 flex flex-col gap-4"
              : "rounded-md px-3 py-4"
        }
      `}
    >
      {!isStack && (
        <div className=" flex items-center justify-between">
          <h2
            className={`
        font-semibold text-foreground

        ${isDashboard ? "text-[16px]" : "text-lg"}
      `}
          >
            Leave Balance
          </h2>

          {isDashboard && (
            <Button
              variant="link"
              onClick={() => router.push("/timehub/leaves")}
              className="group flex items-center gap-1 p-0"
            >
              View All Leaves
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 "/>
            </Button>
          )}
        </div>
      )}

      <div
        className={`grid items-stretch ${
          isGrid
            ? "grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3"
            : isDashboard
              ? "grid-cols-2 gap-3"
              : "grid-cols-1 gap-2"
          // isGrid || isDashboard ? "grid-cols-2 gap-3" : "grid-cols-1 gap-2"
        }`}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`
    h-full flex items-center border border-dashboard-border bg-card

    ${
      isDashboard
        ? "rounded-sm py-5 px-3 gap-3"
        : isGrid
          ? "rounded-md py-6 px-3 gap-3"
          : "rounded-sm p-2.5 gap-5"
    }
  `}
              >
                <div className="flex flex-1 flex-col gap-1">
                  <Skeleton className="h-2.75 w-24" />

                  <Skeleton className="h-7 w-16" />

                  <Skeleton className="h-1 w-full rounded-full" />
                </div>

                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              </div>
            ))
          : leaveData.map((item, i) => {
              const config = getLeaveTheme(item.title, i);
              return (
                <div
                  key={i}
                  className={`
                h-full flex items-center border border-dashboard-border bg-card

                ${
                  isDashboard
                    ? "rounded-sm py-5 px-3 gap-3"
                    : isGrid
                      ? "rounded-md py-6 px-3 gap-3"
                      : "rounded-sm p-2.5 gap-5"
                }
              `}
                >
                  <div
                    className={`flex flex-1 flex-col ${
                      isDashboard ? "gap-1" : isGrid ? "gap-1" : "gap-1"
                    }`}
                  >
                    <span className="text-[11px] font-semibold">
                      {item.title}
                    </span>

                    <div
                      className={`flex flex-col ${isStack ? "gap-1" : "gap-0.5"}`}
                    >
                      <div
                        className={`
                      font-bold text-foreground

                      ${
                        isDashboard
                          ? "text-[15px]"
                          : isGrid
                            ? "text-lg"
                            : "text-base"
                      }
                    `}
                      >
                        {item.used}/{item.total}
                      </div>

                      <div
                        className={`
                      rounded-full bg-muted

                      ${isDashboard ? "h-1" : "h-1"}
                    `}
                      >
                        <div
                          className="h-1 rounded-full"
                          style={{
                            width: `${getProgress(item.used, item.total)}%`,
                            backgroundColor: config.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Image
                      src={config.icon}
                      alt={item.title}
                      width={20}
                      height={20}
                      className={`object-contain
                        ${isDashboard ? "w-10" : isGrid ? "w-10" : "w-10"}`}
                    />
                  </div>
                </div>
              );
            })}
      </div>

      {isDashboard && (
        <Button
          className="w-full rounded-sm  cursor-pointer py-5 flex gap-2"
          onClick={() => router.push("/timehub/leaves/apply")}
        >
          Apply Leave
          <MoveRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
