import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { iconMap } from "@/lib/icon-map";
import { cva, type VariantProps } from "class-variance-authority";

const genericBadgeVariants = cva("text-xs items-center text-center", {
  variants: {
    variant: {
      default: "rounded-xs py-0.5 px-1",
      pill: "rounded-full p-0 m-0 px-2 py-0",
      transparent:
        "rounded-xs bg-transparent text-primary outline outline-muted-foreground/20 py-0.5 px-1",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface GenericBadgeProps
  extends
    React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof genericBadgeVariants> {
  label: string;
  color?: string;
  icon?: string;
  className?: string;
  displayIcon?: boolean;
}

const GenericBadge: React.FC<GenericBadgeProps> = ({
  variant,
  label,
  color,
  icon,
  className,
  displayIcon = true,
  ...props
}) => {
  const IconElement = icon && displayIcon ? iconMap[icon] : null;

  return (
    <Badge
      className={cn(genericBadgeVariants({ variant }), className, "flex gap-1")}
      {...(color && { style: { backgroundColor: color } })}
      {...props}
    >
      {IconElement && <IconElement className="w-4 h-4" />}
      {label && label.length > 15 ? `${label.slice(0, 15)}…` : label}
    </Badge>
  );
};

export default React.memo(GenericBadge);
