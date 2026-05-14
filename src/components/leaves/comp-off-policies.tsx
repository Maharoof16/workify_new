"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import leaveImg from "@/assets/Leave-Banner.png";

export default function CompOffPolicyCard() {
  return (
    <div className="w-full h-full  rounded-2xl border p-3 flex flex-col justify-between">
      <div className="flex flex-col gap-3">
        <h2 className="font-semibold text-primary">
          Comp Off Policy Highlights
        </h2>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex gap-2">
            <ArrowUpRight className="w-4 h-4 text-primary shrink-0" />
            <p className="text-xs">
              Comp Offs must be claimed within 60 days of working on a holiday.
            </p>
          </div>

          <div className="flex gap-2">
            <ArrowUpRight className="w-4 h-4 text-primary  shrink-0" />
            <p className="text-xs">
              Minimum 4 hours work required for Half Day, 8 hours for Full Day
              credit.
            </p>
          </div>
          <div className="flex gap-2">
            <ArrowUpRight className="w-4 h-4 text-primary  shrink-0" />
            <p className="text-xs">
              Manager approval is required for all compensatory leave requests.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Image src={leaveImg} alt="Comp Off Policy" />
      </div>
    </div>
  );
}
