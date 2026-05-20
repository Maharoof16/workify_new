import vgen from "@/assets/vgen.png";
import appraisal from "@/assets/appraisal.png";
import { EmployeeFeed } from "./dashboard";

export const EmployeeFeedData: EmployeeFeed[] = [
  {
    id: "1",
    title: "VGen Launch",
    tag: "New",
    description:
      "We are excited to announce the launch of VGen, our new AI-powered video generation tool. Try it out today!",
    createdAt: "2026-05-20T08:30:00Z",
    imageUrl: vgen,
  },
  {
    id: "2",
    title: "Your Yearly Appraisal is Coming ",
    description:
      "Performance review cycle begins Apr 1. Start preparing your self-assessment and goals.",
    createdAt: "2026-05-19T08:30:00Z",
    imageUrl: appraisal,
  },
];
