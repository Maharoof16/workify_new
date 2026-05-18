"use client";

import GenericBadge from "@/components/common/generic-badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Assignee = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type Project = {
  id: string;
  title: string;
  status: "Open" | "Completed" | "In Progress" | "On Hold";
  priority: "Low" | "Medium" | "High";
  createdAt: string;
  assignees: Assignee[];
};

type Props = {
  projects: Project[];
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

function getPriorityStyles(priority?: string) {
  switch (priority) {
    case "High":
      return "status-danger";

    case "Medium":
      return "status-warning";

    default:
      return "status-success";
  }
}

function getStatusStyles(status?: string) {
  switch (status) {
    case "Completed":
      return "status-success";

    case "On Hold":
      return "status-warning";

    case "In Progress":
      return "status-neutral";

    default:
      return "status-info";
  }
}

export default function ProjectCards({ projects, loading }: Props) {
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
    max-h-[calc(5*135px)]
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
          <div className="flex h-full items-center justify-center">
            Loading...
          </div>
        ) : projects.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No projects assigned
            </p>
          </div>
        ) : (
          projects.map((project) => (
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
                    variant="pill"
                    className={cn(
                      "text-[12px] px-3 font-medium border-0",
                      getPriorityStyles(project.priority),
                    )}
                  />
                </div>
              </div>

              {/* Bottom */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <GenericBadge
                  label={project.status}
                  variant="default"
                  className={cn(
                    "text-[12px] font-medium border-0",
                    getStatusStyles(project.status),
                  )}
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
          ))
        )}
      </div>
    </div>
  );
}
