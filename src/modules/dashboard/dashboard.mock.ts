import vgen from "@/assets/vgen.png";
import appraisal from "@/assets/appraisal.png";
import training from "@/assets/traininggoals.png";
import React from "@/assets/reactjs.png";
import profile from "@/assets/profile.png";
import { EmployeeFeed, PerformanceCard, TFocusItem } from "./dashboard";

export const mockFocusData: TFocusItem[] = [
  {
    id: "1",
    title: "Leave request from Priya Sharma",
    subtitle: "Casual Leave, Mar 12-14",
    imageUrl: profile,
    actions: "leave",
  },
  {
    id: "2",
    title: "Complete Q1 Performance Review",
    subtitle: "Due Mar 15",
    imageUrl: profile,
    actions: "priority",
  },
  {
    id: "3",
    title: "Frontend Developer - Round 2",
    subtitle: "Scheduled Mar 11, 3:00 PM",
    imageUrl: profile,
    actions: "meeting",
  },
];

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

export const performanceCards: PerformanceCard[] = [
  {
    id: "1",
    type: "TRAINING",
    title: "Training Goals",
    completedModules: 5,
    totalModules: 7,
    imageUrl: training,
    items: [
      {
        id: "1",
        title: "Javascript Basics",
        status: "IN_PROGRESS",
      },
      {
        id: "2",
        title: "Advanced CSS",
        status: "COMPLETED",
      },
    ],
  },
  {
    id: "2",
    type: "CERTIFICATION",
    title: "React JS Certification",
    completedModules: 1,
    totalModules: 3,
    imageUrl: React,
    items: [
      {
        id: "1",
        title: "React Fundamentals",
        status: "COMPLETED",
      },
      {
        id: "2",
        title: "React Hooks",
        status: "IN_PROGRESS",
      },
    ],
  },
];
