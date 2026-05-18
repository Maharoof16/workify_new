// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import GenericForm, { Field } from "@/components/common/generic-form";
// import { format } from "date-fns";
// import { useMemo, useState } from "react";
// import { useLocation } from "../../location/use-location";
// import { toSelectOptions } from "@/lib/utils";
// import { HolidayForm, HolidayFormValues } from "./holiday-form";
// import { toast } from "sonner";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   holidayId?: string | null;
//   selectedDate?: Date | null;
// };

// export function HolidayDialog({
//   open,
//   onClose,
//   holidayId,
//   selectedDate,
// }: Props) {
//   const [submitting, setSubmitting] = useState(false);

//   // const { create, update } = useHoliday();

//   const handleSubmit = async (data: HolidayFormValues) => {
//     setSubmitting(true);

//     try {
//       // if (holidayId) {
//       //   await update({ id: holidayId, payload: data });
//       //   toast.success("Holiday updated");
//       // } else {
//       //   await create(data);
//       //   toast.success("Holiday created");
//       // }

//       onClose();
//       return true;
//     } catch (err) {
//       toast.error("Something went wrong");
//       return false;
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-md p-6">
//         <DialogHeader>
//           <DialogTitle>
//             {holidayId ? "Edit Holiday" : "Create Holiday"}
//           </DialogTitle>
//         </DialogHeader>

//         <HolidayForm
//           id={holidayId ?? undefined}
//           onSubmit={handleSubmit}
//           isSubmitting={submitting}
//           selectedDate={selectedDate}
//           onClose={onClose}
//         />
//       </DialogContent>
//     </Dialog>
//   );
// }
