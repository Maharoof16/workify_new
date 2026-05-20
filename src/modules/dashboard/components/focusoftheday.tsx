"use client";

import Image from "next/image";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { TFocusItem } from "@/modules/dashboard/dashboard";
import { DashboardService } from "@/modules/dashboard/dashboard.service";
import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type FocusOfTheDayProps = {
  data: TFocusItem[];
  loading?: boolean;
};


export default function FocusOfTheDay({
  data = [],
  loading = false,
}: FocusOfTheDayProps) {
  return (
    <div
      className="border border-dashboard-border
  bg-linear-to-b
  from-dashboard-card-from
  to-dashboard-card-to rounded-xl  p-0"
    >
      <CardContent className="px-4 py-3 flex flex-col gap-2">
        <div>
          <h3 className="text-base font-semibold py-2">Focus of the Day</h3>
        </div>
{loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-[#E3ECF5] bg-white px-2 py-2"
              >
                <Skeleton className="h-10 w-10 rounded-full" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>

                <Skeleton className="h-8 w-20 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
        <div className="space-y-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 lg:flex-row
                lg:items-center
                lg:justify-between rounded-lg border border-[#E3ECF5] bg-white px-2 py-1"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-[15px] font-semibold text-[#001E4B]">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs text-[#7D8CA1]">{item.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {item.actions === "leave" && (
                  <>
                    <button className="cursor-pointer flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl bg-[#EAF8EF] transition hover:scale-105">
                      <Check className="h-3 w-3 md:h-5 md:w-5 text-[#17B26A]" />
                    </button>

                    <button className="cursor-pointer flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl bg-[#FFF1F1] transition hover:scale-105">
                      <X className="h-3 w-3 md:h-5 md:w-5 text-[#F04438]" />
                    </button>
                  </>
                )}

                {item.actions === "priority" && (
                  <button className="cursor-pointer rounded-xl bg-[#FFF1F1] px-4 py-2 text-xs md:text-sm font-medium text-[#F04438]">
                    High Priority
                  </button>
                )}

                {item.actions === "meeting" && (
                  <>
                    <button className="cursor-pointer rounded-xl border border-[#D6E4F2] bg-white px-4 py-2 text-xs md:text-sm font-medium text-[#1683E2] transition hover:bg-[#F7FAFF]">
                      Reschedule
                    </button>

                    <button className="cursor-pointer rounded-xl bg-[#1683E2] px-5 py-2 text-xs md:text-sm font-medium text-white transition hover:opacity-90">
                      Join
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        )}
      </CardContent>
    </div>
  );
}
