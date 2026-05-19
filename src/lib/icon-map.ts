// icon-map.ts
import * as LucideIcons from "lucide-react";
import React from "react";
import { icon_list } from "./constant";

export const iconMap: Record<
  string,
  React.ForwardRefExoticComponent<
    Omit<LucideIcons.LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >
> = Object.fromEntries(
  icon_list
    .filter((name): name is keyof typeof LucideIcons => name in LucideIcons)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((name) => [name, (LucideIcons as any)[name]]),
);
