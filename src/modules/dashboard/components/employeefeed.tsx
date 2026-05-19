"use client";

import Image from "next/image";
import vgen from "@/assets/vgen.png";
import appraisal from "@/assets/appraisal.png";

const feedData = [
  {
    title: "VGen Launch",
    tag: "New",
    description:
      "We are excited to announce the launch of VGen, our new AI-powered video generation tool. Try it out today!",
    time: "2 Hours Ago",
    image: vgen,
  },
  {
    title: "Your Yearly Appraisal is Coming ",
    description:
      "Performance review cycle begins Apr 1. Start preparing your self-assessment and goals.",
    time: "1 Day Ago",
    image: appraisal,
  },
];

export function EmployeeFeedCard() {
  return (
    <div className="w-full rounded-xl border border-border bg-linear-to-b from-[#F6FAFE] to-white p-4">
      <h2 className="text-lg font-semibold text-text mb-4">Employee Feed</h2>

      <div className="flex flex-col gap-3">
        {feedData.map((item, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row gap-3 rounded-md border border-border bg-surface px-2 py-5 hover:shadow-sm transition"
          >
            <div className="relative h-20 w-full sm:h-16 sm:w-28 shrink-0 overflow-hidden rounded-md">
              <Image
                src={item.image}
                alt={item.title}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-text">
                  {item.title}
                </h3>

                {item.tag && (
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {item.tag}
                  </span>
                )}
              </div>

              <p className="text-xs text-textMuted xl:max-w-8/12">
                {item.description}
              </p>
            </div>

            <span className="text-xs text-textMuted whitespace-nowrap">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
