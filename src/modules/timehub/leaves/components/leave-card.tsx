"use client";

import { useRouter } from "next/navigation";
import casualLeaveIcon from "@/assets/casual-leave.png";
import sickLeaveIcon from "@/assets/sick-leave.png";
import earnedLeaveIcon from "@/assets/earned-leave.png";
import compOffIcon from "@/assets/comp-off.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

function getProgress(used: number, total: number) {
  if (!total) return 0;

  return Math.min(Math.round((used / total) * 100), 100);
}

const leaveData = [
  {
    title: "Casual Leave",
    used: 8,
    total: 12,
    icon: casualLeaveIcon,
    color: "#1482DD",
  },
  {
    title: "Sick Leave",
    used: 4,
    total: 12,
    icon: sickLeaveIcon,
    color: "#10B981",
  },
  {
    title: "Earned Leave",
    used: 15,
    total: 12,
    icon: earnedLeaveIcon,
    color: "#7C3AED",
  },
  {
    title: "Comp - Off",
    used: 2,
    total: 3,
    icon: compOffIcon,
    color: "#F59E0B",
  },
];

type Variant = "grid" | "stack" | "dashboard";

export function LeaveBalanceCard({ variant = "grid" }: { variant?: Variant }) {
  const isGrid = variant === "grid";
  const isStack = variant === "stack";
  const isDashboard = variant === "dashboard";
  const router = useRouter();

  return (
    <div
      className={`
          w-full h-full bg-[#F8FBFF]
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
        font-semibold text-[#0F172A]

        ${isDashboard ? "text-[16px]" : "text-lg"}
      `}
          >
            Leave Balance
          </h2>

          {isDashboard && (
            <Button
              variant={"link"}
              onClick={() => router.push("/timehub/leaves")}
            >
              View All Leaves →
            </Button>
          )}
        </div>
      )}

      <div
        className={`grid items-stretch ${
          isGrid ? "grid-cols-1 xl:grid-cols-2 gap-3" : isDashboard ? "grid-cols-2 gap-3" :"grid-cols-1 gap-2"
          // isGrid || isDashboard ? "grid-cols-1 xl:grid-cols-2 gap-3" : "grid-cols-1 gap-2"
        }`}
      >
        {leaveData.map((item, i) => {
          const iconSrc = item.icon;
          return (
            <div
              key={i}
              className={`
                h-full flex items-center border border-[#D9E2F2] bg-white

                ${
                  isDashboard
                    ? "rounded-sm py-5 px-3 gap-3"
                    : isGrid
                      ? "rounded-md py-10 px-3 gap-3"
                      : "rounded-sm p-2.5 gap-5"
                }
              `}
            >
              <div
                className={`flex flex-1 flex-col ${
                  isDashboard ? "gap-1" : isGrid ? "gap-1" : "gap-1"
                }`}
              >
                <span className="text-[11px] font-semibold">{item.title}</span>

                <div
                  className={`flex flex-col ${isStack ? "gap-1" : "gap-0.5"}`}
                >
                  <div
                    className={`
                      font-bold text-[#0F172A]

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
                      rounded-full bg-[#E2E8F0]

                      ${isDashboard ? "h-1" : "h-1"}
                    `}
                  >
                    <div
                      className="h-1 rounded-full"
                      style={{
                        width: `${getProgress(item.used, item.total)}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Image
                  src={iconSrc}
                  alt={item.title}
                  width={20}
                  height={20}
                  className={`
    object-contain
    ${isDashboard ? "w-10" : isGrid ? "w-10" : "w-10"}
  `}
                />
              </div>
            </div>
          );
        })}
      </div>

      {isDashboard && (
        <Button
          className="w-full rounded-sm py-5 flex gap-2"
          onClick={() => router.push("/timehub/leaves/apply")}
        >
          Apply Leave
          <MoveRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
