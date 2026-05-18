"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import leaveImg from "@/assets/Leave-Banner.png";

type LeavePolicyCardProps = {
  variant?: "apply" | "modify";
};

export default function LeavePolicyCard({
  variant = "apply",
}: LeavePolicyCardProps) {
  return (
    <div className="w-full h-full  rounded-2xl border p-3 flex flex-col justify-between">
      <div className="flex flex-col gap-3">
        <h2 className="font-semibold text-primary">Leave Policy Reminder</h2>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex gap-2">
            <ArrowUpRight className="w-4 h-4 text-primary shrink-0" />
            <p className="text-xs">
              {variant === "apply"
                ? " Please ensure all leave requests are submitted at least 48 hours prior to the start date for adequate resource planning."
                : "Requests must be edited or cancelled at least 48 hours prior to the start date."}
            </p>
          </div>

          <div className="flex gap-2">
            <ArrowUpRight className="w-4 h-4 text-primary shrink-0" />
            <p className="text-xs">
              {variant === "apply"
                ? "For medical emergencies, documents can be attached post-submission."
                : "For cancellations within the 48-hour window, please contact your immediate supervisor and HR Business Partner for manual override."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Image src={leaveImg} alt="Leave Policy" height={220} width={220} />
      </div>
    </div>
  );
}
