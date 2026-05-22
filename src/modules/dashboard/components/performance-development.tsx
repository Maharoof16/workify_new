"use client";

import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";
import { PerformanceCard } from "../dashboard";
import { Skeleton } from "@/components/ui/skeleton";

type PerformanceDevelopmentProps = {
  data: PerformanceCard[];
  loading?: boolean;
};

export default function PerformanceDevelopment({
  data = [],
  loading = false,
}: PerformanceDevelopmentProps) {
  return (
    <div
      className="border border-dashboard-border
  bg-linear-to-b
  from-dashboard-card-from
  to-dashboard-card-to rounded-xl  p-0"
    >
      <CardContent className="p-4">
        <h3 className="text-base font-semibold py-2">
          Performance & Development
        </h3>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-md border border-border bg-card  p-3 space-y-5"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-11 w-11 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>

                <Skeleton className="h-2 w-full" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>

                <Skeleton className="h-8 w-24 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.map((card, index) => {
              const completed = `${card.completedModules} / ${card.totalModules} Completed`;

              const progress =
                (card.completedModules / card.totalModules) * 100;

              return (
                <div
                  key={index}
                  className=" flex flex-col gap-3 rounded-md
          border border-border
          bg-card/70
          backdrop-blur-sm
          p-3"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="
              relative h-11 w-11 overflow-hidden rounded-full
              bg-info
            "
                    >
                      <Image
                        src={card.imageUrl}
                        alt={card.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-[16px] font-semibold text-foreground">
                        {card.title}
                      </h3>

                      <p className="text-xs text-muted-foreground">
                        {completed}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-[2px]">
                    {Array.from({ length: card.totalModules }).map(
                      (_, index) => (
                        <div
                          key={index}
                          className={`h-2 flex-1 rounded-sm ${
                            index < card.completedModules
                              ? "bg-linear-to-b from-[#47BD47] to-[#08A749]"
                              : "bg-muted"
                          }`}
                        />
                      ),
                    )}
                  </div>

                  <div className="space-y-2">
                    {card.items.slice(0, 2).map((item, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between">
                          <p className="text-[15px] text-foreground">
                            {item.title}
                          </p>

                          <span className="text-[14px] text-muted-foreground">
                            {item.status === "NOT_STARTED"
                              ? "Not Started"
                              : item.status === "IN_PROGRESS"
                                ? "In Progress"
                                : "Completed"}
                          </span>
                        </div>

                        {idx !== card.items.length - 1 && (
                          <div className="py-1 border-b border-border" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      className=" h-8 rounded-sm border border-border bg-secondary px-5 py-4 text-xs font-medium text-info hover:bg-info hover:text-info-foreground transition-all"
                    >
                      View Goals
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </div>
  );
}
