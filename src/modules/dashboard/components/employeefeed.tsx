"use client";

import Image from "next/image";
import { EmployeeFeed } from "../dashboard";
import { getTimeAgo } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type EmployeeFeedProps = {
  data: EmployeeFeed[];
  loading?: boolean;
};

export function EmployeeFeedCard({
  data = [],
  loading = false,
}: EmployeeFeedProps) {
  return (
    <div className="w-full rounded-xl border border-border bg-linear-to-b from-[#F6FAFE] to-white p-4">
      <h2 className="text-lg font-semibold text-text mb-4">Employee Feed</h2>

      <div className="flex flex-col gap-3">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="
            flex flex-col sm:flex-row gap-3
            rounded-md border border-border
            bg-surface px-2 py-5
          "
              >
                <Skeleton
                  className="
              h-20 w-full
              sm:h-16 sm:w-28
              rounded-md shrink-0
            "
                />

                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-40" />

                    <Skeleton className="h-5 w-12 rounded-md" />
                  </div>

                  <Skeleton className="h-3 w-full" />

                  <Skeleton className="h-3 w-9/12" />
                </div>

                <Skeleton className="h-3 w-20" />
              </div>
            ))
          : data.map((item, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-3 rounded-md border border-border bg-surface px-2 py-5 hover:shadow-sm transition"
              >
                <div className="relative h-20 w-full sm:h-16 sm:w-28 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-text">
                      {item.title}
                    </h3>

                    {item.tag && (
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-textMuted xl:max-w-8/12">
                    {item.description}
                  </p>
                </div>

                <span className="text-xs text-textMuted whitespace-nowrap">
                  {getTimeAgo(item.createdAt)}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
}
