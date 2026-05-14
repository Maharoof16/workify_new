"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import AttendancePolicy from "@/assets/Attenndance-Policy.png";

export default function AttendancePolicyCard() {
  return (
    <div className="w-full h-full  rounded-2xl border p-3 flex flex-col justify-between">
      <div className="flex flex-col gap-3">
        <h2 className="font-semibold text-primary">Attendance Policy Reminder</h2>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex gap-2">
            <ArrowUpRight className="w-4 h-4 text-primary shrink-0" />
            <p className="text-xs">
              Regularization requests must be submitted within 48 hours of the
              discrepancy.
            </p>
          </div>

          <div className="flex gap-2">
            <ArrowUpRight className="w-4 h-4 text-primary shrink-0" />
            <p className="text-xs">
              Requests exceeding 3 occurrences per month require HOD approval.
            </p>
          </div>

          <div className="flex gap-2">
            <ArrowUpRight className="w-4 h-4 text-primary shrink-0" />
            <p className="text-xs">
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
