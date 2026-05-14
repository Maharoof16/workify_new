import { ColumnDef, HeaderContext } from "@tanstack/react-table";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
// import { iconMap } from "./icon-map";
// import { StopPropagation } from "@/components/common/stop-propagation";
// import { ResourceType } from "@/modules/organization/entity-label/entitylabel";
// import { Action, hasPermission } from "./constant";

interface StatusToggleOption<T> {
  field: keyof T;
  header?: string;
  onChange?: (item: T, checked: boolean) => void;
  disabled?: (item: T) => boolean;
  // resource?: ResourceType;
  // action?: Action;
}

type ColumnRenderer<T> = {
  header?: (ctx?: HeaderContext<T, unknown>) => React.ReactNode;
  cell?: (item: T) => React.ReactNode;
  // footer?: (ctx: HeaderContext<T, unknown>) => React.ReactNode;
};

interface BuildColumnsOptions<T> {
  headers: string[];
  customRenderers?: Record<string, ColumnRenderer<T>>;
  withSelect?: boolean;
  withSerial?: boolean;
  withColor?: boolean | string;
  withIcon?: boolean | string;
  withStatusToggle?: boolean | StatusToggleOption<T>;
  permissions?: string[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildColumns<T extends Record<string, any>>({
  headers,
  customRenderers = {},
  withSelect = false,
  withSerial = false,
  withColor = false,
  withIcon = false,
  withStatusToggle = false,
  permissions = [],

}: BuildColumnsOptions<T>): ColumnDef<T>[] {
  const cols: ColumnDef<T>[] = [];
  const columnCount = headers.length;

  const truncateLength =
    columnCount <= 2 ? 80 :
      columnCount <= 4 ? 70 :
        columnCount <= 6 ? 60 :
          columnCount <= 8 ? 50 :
            30;

  // Serial column
  if (withSerial) {
    cols.push({
      id: "serial",
      header: "S.No",
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
      enableHiding: false,
    });
  }

  // Select column
  if (withSelect) {
    cols.push({
      id: "select",
      header: ({ table }) => (
        // <StopPropagation>
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        // </StopPropagation>
      ),
      cell: ({ row }) => (
        // <StopPropagation>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        // </StopPropagation>
      ),
      enableSorting: false,
      enableHiding: false,
    });
  }

  // Generate data columns
  headers.forEach((header) => {
    const keys = header.split(" ");
    const k = keys[0].toLowerCase();
    const ks = keys
      .map((key) => key.charAt(0).toUpperCase() + key.slice(1))
      .splice(1);
    // const key = header.replace(/ /g, "") as keyof T;
    let key = [...k, ...ks].join("");

    // detect status column
    let isStatus =
      withStatusToggle && typeof withStatusToggle === "object"
        ? withStatusToggle.header
          ? withStatusToggle.header.toLowerCase() === header.toLowerCase()
          : withStatusToggle.field === key
        : false;

    // if (isStatus && typeof withStatusToggle === "object" && withStatusToggle.resource) {
    //   const allowed = hasPermission(
    //     permissions,
    //     withStatusToggle.resource,
    //     withStatusToggle.action ?? "write"
    //   );

    //   if (!allowed) {
    //     return; 
    //   }
    // }

    cols.push({
      accessorKey: key as string,
      id: key as string,
      header: customRenderers[header]?.header ?? header,
      cell: ({ row }) => {
        const value = row.original[key];
        const item = row.original;

        // Status toggle
        if (isStatus && typeof withStatusToggle === "object") {
          const field = withStatusToggle.field as keyof T;
          const isActive = Boolean(item[field]);
          const isDisabled = withStatusToggle.disabled?.(item) ?? false;

          return (
            // <StopPropagation className="flex items-center gap-2">
            <>
              <Switch
                className="cursor-pointer"
                checked={isActive}
                disabled={isDisabled}
                onCheckedChange={(checked) =>
                  withStatusToggle.onChange?.(item, checked)
                }
              />
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
                          </>

            // </StopPropagation>
          );
        }

        // Custom cell renderer
        if (customRenderers[header]?.cell) {
          return customRenderers[header]!.cell!(item);
        }

        // Color
        if (
          withColor &&
          typeof value === "string" &&
          key === String(withColor).toLowerCase()
        ) {
          return (
            <div className="flex items-center gap-2">
              <div
                style={{ backgroundColor: value }}
                className="h-4 w-4 rounded"
              />
              {value}
            </div>
          );
        }

        // Icon
        // if (
        //   withIcon &&
        //   typeof value === "string" &&
        //   key === String(withIcon).toLowerCase()
        // ) {
        //   const IconComp = iconMap[value];
        //   const color =
        //     withColor && typeof withColor === "string"
        //       ? item[withColor.toLowerCase()]
        //       : null;

        //   return IconComp ? (
        //     <IconComp
        //       className="w-4 h-4"
        //       style={{ color: color || undefined }}
        //     />
        //   ) : (
        //     value
        //   );
        // }

        // Truncate long text
        // if (typeof value === "string" && value.length > 30) {
        //   return value.slice(0, 30) + "...";
        // }
        if (typeof value === "string" && value.length > truncateLength) {
          return value.slice(0, truncateLength) + "...";
        }

        return value ?? "N/A";
      },
    } as ColumnDef<T>);
  });

  return cols;
}

// import { ColumnDef, HeaderContext } from "@tanstack/react-table";
// import React from "react";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Switch } from "@/components/ui/switch";
// import { Badge } from "@/components/ui/badge";
// import { iconMap } from "./icon-map";
// import { StopPropagation } from "@/components/common/stop-propagation";

// interface StatusToggleOption<T> {
//   field: keyof T;
//   header?: string;
//   onChange?: (item: T, checked: boolean) => void;
//   disabled?: (item: T) => boolean;
// }

// type ColumnRenderer<T> = {
//   header?: (ctx: HeaderContext<T, unknown>) => React.ReactNode;
//   cell?: (item: T) => React.ReactNode;
//   // footer?: (ctx: HeaderContext<T, unknown>) => React.ReactNode;
// };

// interface BuildColumnsOptions<T> {
//   headers: string[];
//   customRenderers?: Record<string, ColumnRenderer<T>>;
//   withSelect?: boolean;
//   withSerial?: boolean;
//   withColor?: boolean | string;
//   withIcon?: boolean | string;
//   withStatusToggle?: boolean | StatusToggleOption<T>;
// }

// const formatHeader = (header: string) =>
//   header.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function buildColumns<T extends Record<string, any>>({
//   headers,
//   customRenderers = {},
//   withSelect = false,
//   withSerial = false,
//   withColor = false,
//   withIcon = false,
//   withStatusToggle = false,
// }: BuildColumnsOptions<T>): ColumnDef<T>[] {
//   const cols: ColumnDef<T>[] = [];

//   // Serial column
//   if (withSerial) {
//     cols.push({
//       id: "serial",
//       header: "S.No",
//       cell: ({ row }) => row.index + 1,
//       enableSorting: false,
//       enableHiding: false,
//     });
//   }

//   // Select column
//   if (withSelect) {
//     cols.push({
//       id: "select",
//       header: ({ table }) => (
//         <StopPropagation>
//           <Checkbox
//             checked={
//               table.getIsAllPageRowsSelected() ||
//               (table.getIsSomePageRowsSelected() && "indeterminate")
//             }
//             onCheckedChange={(value) =>
//               table.toggleAllPageRowsSelected(!!value)
//             }
//             aria-label="Select all"
//           />
//         </StopPropagation>
//       ),
//       cell: ({ row }) => (
//         <StopPropagation>
//           <Checkbox
//             checked={row.getIsSelected()}
//             onCheckedChange={(value) => row.toggleSelected(!!value)}
//             aria-label="Select row"
//           />
//         </StopPropagation>
//       ),
//       enableSorting: false,
//       enableHiding: false,
//     });
//   }

//   headers.forEach((header) => {
//     const key = header.toLowerCase().replace(/ /g, "_") as keyof T;

//     // detect status column
//     const isStatus =
//       withStatusToggle && typeof withStatusToggle === "object"
//         ? withStatusToggle.header
//           ? withStatusToggle.header.toLowerCase() === header.toLowerCase()
//           : withStatusToggle.field.toLocaleString().toLowerCase() === key
//         : false;

//     cols.push({
//       id: header,
//       // header: customRenderers[header]?.header ?? header,
//       header: customRenderers[header]?.header ?? formatHeader(header),

//       accessorFn: (row) => row?.[header],
//       cell: ({ row }) => {
//         const item = row.original;
//         const value = item?.[header];

//         // Status toggle
//         if (isStatus && typeof withStatusToggle === "object") {
//           const field = withStatusToggle.field;
//           const isActive = Boolean(item[field]);
//           const isDisabled = withStatusToggle.disabled?.(item) ?? false;

//           return (
//             <StopPropagation className="flex items-center gap-2">
//               <Switch
//                 className="cursor-pointer"
//                 checked={isActive}
//                 disabled={isDisabled}
//                 onCheckedChange={(checked) =>
//                   withStatusToggle.onChange?.(item, checked)
//                 }
//               />
//               <Badge variant={isActive ? "default" : "secondary"}>
//                 {isActive ? "Active" : "Inactive"}
//               </Badge>
//             </StopPropagation>
//           );
//         }

//         // Custom cell renderer
//         if (customRenderers[header]?.cell) {
//           return customRenderers[header]!.cell!(item);
//         }

//         // Color
//         if (
//           withColor &&
//           typeof value === "string" &&
//           header.toLowerCase() === String(withColor).toLowerCase()
//         ) {
//           return (
//             <div className="flex items-center gap-2">
//               <div
//                 style={{ backgroundColor: value }}
//                 className="h-4 w-4 rounded"
//               />
//               {value}
//             </div>
//           );
//         }

//         // Icon
//         if (
//           withIcon &&
//           typeof value === "string" &&
//           header.toLowerCase() === String(withIcon).toLowerCase()
//         ) {
//           const IconComp = iconMap[value];
//           const color =
//             withColor && typeof withColor === "string"
//               ? item[withColor.toLowerCase()]
//               : null;

//           return IconComp ? (
//             <IconComp
//               className="w-4 h-4"
//               style={{ color: color || undefined }}
//             />
//           ) : (
//             value
//           );
//         }

//         // Truncate long text
//         if (typeof value === "string" && value.length > 30) {
//           return value.slice(0, 30) + "...";
//         }

//         return value ?? "N/A";
//       },
//     } as ColumnDef<T>);
//   });

//   return cols;
// }
