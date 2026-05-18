// "use client";

// import GenericForm, { Field } from "@/components/common/generic-form";
// import { format } from "date-fns";
// import { useState } from "react";
// import { useLocation } from "../../location/use-location";
// import { toSelectOptions } from "@/lib/utils";
// import { useDepartment } from "../../department/use-department";

// type HolidayFormProps = {
//   id?: string;
//   onSubmit: (data: HolidayFormValues) => Promise<boolean>;
//   isSubmitting?: boolean;
//   selectedDate?: Date | null;
//   onClose?:()=>void;
  
// };

// export type HolidayFormValues = {
//   title: string;
//   description?: string;
//   date: string;
//   type: "PUBLIC" | "OPTIONAL" | "REGIONAL";
//   scope: "ORGANIZATION" | "LOCATION" | "DEPARTMENT";
//   location?: string[];
//   department?: string[];
//   isRecurring?: boolean;
//   isActive?: boolean;
// };

// export function HolidayForm({
//   id,
//   onSubmit,
//   isSubmitting,
//   selectedDate,
//   onClose,
// }: HolidayFormProps) {
//   const [formReadOnly, setFormReadOnly] = useState(!!id);

//   const { referenceList: locations = [] } = useLocation();
//   const { referenceList: departments = [] } = useDepartment();

//   const fields: Field[] = [
//     {
//       name: "title",
//       label: "Holiday Name",
//       type: "text",
//       validation: { required: "Required" },
//       placeholder: "Enter holiday name",
//     },
//     {
//       name: "description",
//       label: "Description",
//       type: "text",
//       placeholder: "Enter description",
//     },
//     {
//       name: "date",
//       label: "Date",
//       type: "date",
//       validation: { required: "Required" },
//     },
//     {
//       name: "type",
//       label: "Type",
//       type: "select",
//       validation: { required: "Required" },
//       options: [
//         { label: "Public", value: "PUBLIC" },
//         { label: "Optional", value: "OPTIONAL" },
//         { label: "Regional", value: "REGIONAL" },
//       ],
//     },
//     {
//       name: "scope",
//       label: "Scope",
//       type: "select",
//       validation: { required: "Required" },
//       options: [
//         { label: "Organization", value: "ORGANIZATION" },
//         { label: "Location", value: "LOCATION" },
//         { label: "Department", value: "DEPARTMENT" },
//       ],
//     },

//     {
//       name: "location",
//       label: "Location",
//       type: "multiselect",
//       options: toSelectOptions(locations, "name", "id"),
//       visible: (values) => values.scope === "LOCATION",
//     },

//     {
//       name: "department",
//       label: "Department",
//       type: "multiselect",
//       options: toSelectOptions(departments, "name", "id"),
//       visible: (values) => values.scope === "DEPARTMENT",
//     },

//     {
//       name: "isRecurring",
//       label: "Recurring",
//       type: "switch",
//     },
//     // {
//     //   name: "isActive",
//     //   label: "Active",
//     //   type: "switch",
//     // },
//   ];

//   return (
//     <GenericForm<HolidayFormValues>
//       //   key={`${id}-${JSON.stringify(data)}`}
//       fields={fields}
//       onSubmit={onSubmit}
//       //   fetchData={fetchData}
//       //   loading={isSubmitting || isLoading}
//       id={id}
//       initialValues={
//         !id && selectedDate
//           ? {
//               date: format(selectedDate, "yyyy-MM-dd"),
//               scope: "ORGANIZATION",
//               type: "PUBLIC",
//               isActive: true,
//             }
//           : undefined
//       }
//       onModeChange={setFormReadOnly}
//       className="flex flex-col gap-2"
//       onClose={onClose}
//     />
//   );
// }
