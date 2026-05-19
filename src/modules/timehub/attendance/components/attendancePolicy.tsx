"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import AttendancePolicy from "@/assets/Attenndance-Policy.png";

export default function AttendancePolicyCard() {
  return (
    <div
      className="px-3 py-4 flex flex-col justify-between  w-full h-full bg-[#F8FBFF]
          border border-dashboard-border
          bg-linear-to-b
          from-dashboard-card-from
          to-dashboard-card-to rounded-xl"
    >
      <div className="flex flex-col gap-3">
         <h2 className="font-semibold text-[18px]">
          Attendance Policy Reminder
        </h2>

               <div className="flex flex-col gap-2 text-sm">
          <div className="flex gap-2">
            <ArrowUpRight className="w-4 h-4 text-primary shrink-0" />
            <p className="text-sm">
              Regularization requests must be submitted within 48 hours of the
              discrepancy.
            </p>
          </div>

         
          <div className="flex gap-2">
            <ArrowUpRight className="w-4 h-4 text-primary  shrink-0" />
            <p className="text-sm">
              Requests exceeding 3 occurrences per month require HOD approval.
            </p>
          </div>

          
          <div className="flex gap-2">
            <ArrowUpRight className="w-4 h-4 text-primary  shrink-0" />
            <p className="text-sm">
              System logs are audited weekly; incorrect entries may lead to
              disciplinary action.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Image src={AttendancePolicy} alt="Attendance Policy" />
      </div>
    </div>
  );
}
