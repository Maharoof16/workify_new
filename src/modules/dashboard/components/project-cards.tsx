"use client";

import GenericBadge from "@/components/common/generic-badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GlobalOption } from "@/modules/config/config";
import { Project } from "@/modules/my-org/projects/project";

type Props = {
  projects: Project[];
  statuses: GlobalOption[];
  priorities: GlobalOption[];
  loading?: boolean;
};

function getDaysAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) return "Today";

  return `${days} Days Ago`;
}

function getInitials(name?: string) {
  return (
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "NA"
  );
}

function getPriorityConfig(priority?: string, priorities?: GlobalOption[]) {
  return priorities?.find(
    (item) =>
      (item.resource === "ALL" || item.resource === "PROJECT") &&
      item.label === priority,
  );
}

function getStatusConfig(status?: string, statuses?: GlobalOption[]) {
  return statuses?.find(
    (item) =>
      (item.resource === "ALL" || item.resource === "PROJECT") &&
      item.label === status,
  );
}

export default function ProjectCards({
  projects,
  statuses,
  priorities,
  loading,
}: Props) {
  return (
    <div
      className="
      rounded-xl
      border border-dashboard-border
      bg-linear-to-b
      from-dashboard-card-from
      to-dashboard-card-to
      p-3
      flex flex-col
      h-full
    max-h-168
    "
    >
      {/* Header */}
      <h3 className="text-base font-semibold py-2">Projects</h3>

      {/* Content */}
      <div
        className={`flex-1 min-h-0 pr-1 space-y-2 ${
          loading ? "overflow-hidden" : "overflow-auto custom-scrollbar"
        }`}
      >
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="
        rounded-md
        border border-dashboard-border
        bg-card
        p-3
      "
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-8/12" />
                    <Skeleton className="h-4 w-5/12" />
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Skeleton className="h-6 w-24 rounded-full" />

                  <div className="flex -space-x-2">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <Skeleton
                        key={idx}
                        className="
                h-8 w-8
                rounded-full
                border-2 border-background
              "
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No projects assigned
            </p>
          </div>
        ) : (
          projects.map((project) => {
            const priorityConfig = getPriorityConfig(
              project.priority,
              priorities,
            );

            const statusConfig = getStatusConfig(project.status, statuses);

            return (
              <div
                key={project.id}
                className="
        rounded-md
        border border-dashboard-border
        bg-card
        p-3
      "
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4
                      className="
              leading-5
              wrap-break-word
              line-clamp-2
              text-sm
              font-semibold
            "
                    >
                      {project.title}
                    </h4>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className="
              text-[11px]
              text-muted-foreground
              whitespace-nowrap
            "
                    >
                      {getDaysAgo(project.createdAt)}
                    </span>

                    <GenericBadge
                      label={project.priority}
                      icon={priorityConfig?.icon}
                      color={priorityConfig?.color}
                      variant="pill"
                      className="text-[12px] px-3 font-medium border-0"
                    />
                  </div>
                </div>

                {/* Bottom */}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <GenericBadge
                    label={project.status}
                    icon={statusConfig?.icon}
                    color={statusConfig?.color}
                    variant="default"
                    className="text-[12px] font-medium border-0"
                  />

                  {/* Assignees */}
                  <div className="flex -space-x-2">
                    {(project.assignees ?? []).slice(0, 4).map((user) => (
                      <Tooltip key={user.id}>
                        <TooltipTrigger asChild>
                          <div
                            className="
                    h-8 w-8
                    rounded-full
                    border-2 border-background
                    bg-primary/10
                    text-primary
                    flex items-center justify-center
                    text-[11px]
                    font-semibold
                    shadow-sm
                    cursor-default
                  "
                          >
                            {getInitials(user.name)}
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>{user.name}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
