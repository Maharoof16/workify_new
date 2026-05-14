import * as React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: number;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  color = "var(--spinner-color)", 
}) => {
  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-t-2 border-r-2",
      )}
      style={{
        width: size,
        height: size,
        borderTopColor: color,
        borderRightColor: "transparent",
      }}
    />
  );
};

export { Spinner };
