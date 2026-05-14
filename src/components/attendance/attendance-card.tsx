"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Status = "success" | "warning" | "info" | "danger" | "neutral";

type Props = {
  title: string;
  value?: ReactNode;
  subtitle?: string;

  icon?: ReactNode;
  status?: Status;

  valueIcon?: ReactNode;

  rightContent?: ReactNode;
  children?: ReactNode;
  className?: string;

  variant?: "default" | "metric";
};

const statusStyles = {
  success: {
    icon: "text-success",
    bg: "bg-success",
    value: "text-success",
  },
  warning: {
    icon: "text-warning",
    bg: "bg-warning",
    value: "text-warning",
  },
  info: {
    icon: "text-info",
    bg: "bg-info",
    value: "text-info",
  },
  danger: {
    icon: "text-danger",
    bg: "bg-danger",
    value: "text-danger",
  },
  neutral: {
    icon: "text-muted-foreground",
    bg: "bg-muted",
    value: "",
  },
};

export function AttendanceCard({
  title,
  value,
  subtitle,
  icon,
  rightContent,
  children,
  className,
  valueIcon,
  variant = "default",
  status = "neutral",
}: Props) {
  const styles = statusStyles[status];

  // METRIC
  if (variant === "metric") {
    return (
      <div
        className={cn(
          "border border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to rounded-xl p-4 flex justify-between",
          className,
        )}
      >
        <div className="flex flex-col">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              {valueIcon && <span className={styles.icon}>{valueIcon}</span>}

              {value && (
                <h3 className={cn("text-md font-semibold", styles.value)}>
                  {value}
                </h3>
              )}
            </div>

            {rightContent && <div>{rightContent}</div>}
          </div>
        </div>

        {icon && (
          <div className={cn("p-2 rounded-full self-center", styles.bg)}>
            <span className={styles.icon}>{icon}</span>
          </div>
        )}
      </div>
    );
  }

  // DEFAULT
  return (
    <div className={cn("relative border border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to rounded-xl p-4", className)}>
      <div className="flex items-start gap-4">
        {children && <div className="shrink-0">{children}</div>}

        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          {value && <h3 className="text-xl font-semibold">{value}</h3>}

          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      {icon && (
        <div
          className={cn("absolute bottom-4 right-4 p-2 rounded-md", styles.bg)}
        >
          <span className={styles.icon}>{icon}</span>
        </div>
      )}

      {rightContent && (
        <div className="absolute bottom-4 right-14">{rightContent}</div>
      )}
    </div>
  );
}
