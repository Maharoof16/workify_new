"use client";

import { Activity, Briefcase, CalendarCheck, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import casualLeaveIcon from "@/assets/casual-leave.png";
import sickLeaveIcon from "@/assets/sick-leave.png";
import earnedLeaveIcon from "@/assets/earned-leave.png";
import compOffIcon from "@/assets/comp-off.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
        w-full border border-[#D9E2F2] bg-[#F8FBFF]

        ${
          isDashboard
            ? "rounded-xl py-3 px-4 flex flex-col gap-5"
            : isGrid
              ? "rounded-md p-4 flex flex-col gap-4"
              : "rounded-md p-2"
        }
      `}
    >
      {/* Header */}
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

      {/* Layout */}
      <div
        className={`grid ${
          isGrid || isDashboard ? "grid-cols-2 gap-3" : "grid-cols-1 gap-2"
        }`}
      >
        {leaveData.map((item, i) => {
          const iconSrc = item.icon;
          return (
            <div
              key={i}
              className={`
                flex items-center border border-[#D9E2F2] bg-white

                ${
                  isDashboard
                    ? "rounded-sm py-5 px-3 gap-3"
                    : isGrid
                      ? "rounded-md py-5 px-3 gap-3"
                      : "rounded-sm p-2.5 gap-5"
                }
              `}
            >
              {/* LEFT */}
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

              {/* RIGHT ICON */}
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

      {/* Bottom Button */}
      {isDashboard && (
        <Button
          className="w-full rounded-sm py-5"
          onClick={() => router.push("/timehub/leaves/apply")}
        >
          Apply Leave →
        </Button>
      )}
    </div>
  );
}
