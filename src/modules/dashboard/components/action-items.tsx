"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { DashboardService } from "../dashboard.service";
import { ActionItems } from "../dashboard";
import { actions } from "../dashboard.mock";


export function ActionItemsCard() {
  //  const [actions, setActions] = useState<ActionItems[]>([]);
  //   const [loading, setLoading] = useState(true);
  
  //   useEffect(() => {
  //     fetchActionItems();
  //   }, []);

  //   const fetchActionItems = async () => {
  //     try {
  //       setLoading(true);

  //       const res = await DashboardService.getActionItems();

  //       setActions(res);
  //     } catch (error) {
  //       console.error("Failed to fetch action items:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const ITEMS_VISIBLE = 5;

  const [startIndex, setStartIndex] = useState(0);

  const visibleActions = actions.slice(startIndex, startIndex + ITEMS_VISIBLE);

  const canGoNext = startIndex + ITEMS_VISIBLE < actions.length;

  const canGoPrev = startIndex > 0;

  return (
    <div
      className="
        border border-dashboard-border
        bg-linear-to-b
        from-dashboard-card-from
        to-dashboard-card-to
        rounded-xl
      "
    >
      <CardContent className="p-4 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-[#001E4B]">
          My Action Items
        </h2>

        <div className="flex items-stretch gap-3">
          {canGoPrev && (
            <Card
              className="
                hidden lg:flex
                w-12 shrink-0
                border border-white/60
                bg-white/80
                rounded-2xl
              "
            >
              <CardContent
                onClick={() => setStartIndex((prev) => Math.max(prev - 1, 0))}
                className="
                  flex h-full items-center justify-center
                  p-0 cursor-pointer
                "
              >
                <ChevronLeft className="h-5 w-5 text-slate-500" />
              </CardContent>
            </Card>
          )}

          {/* ACTIONS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:flex flex-1 gap-3">
            {visibleActions.map((item, i) => (
              <Card
                key={i}
                className="
                  flex-1
                  border border-white/60
                  bg-white/80
                  rounded-md
                "
              >
                <CardContent
                  className="
                    flex flex-col gap-3
                    items-center justify-center
                    text-center p-2
                  "
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={28}
                    height={28}
                    className="object-contain"
                  />

                  <div>
                    <p className="text-sm font-semibold text-[#1e293b]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.subtitle}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {canGoNext && (
            <Card
              className="
                hidden lg:flex
                w-12 shrink-0
                border border-white/60
                bg-white/80
                rounded-2xl
              "
            >
              <CardContent
                onClick={() =>
                  setStartIndex((prev) =>
                    Math.min(prev + 1, actions.length - ITEMS_VISIBLE),
                  )
                }
                className="
                  flex h-full items-center justify-center
                  p-0 cursor-pointer
                  hover:bg-white transition-all
                "
              >
                <ChevronRight className="h-5 w-5 text-slate-500" />
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </div>
  );
}
