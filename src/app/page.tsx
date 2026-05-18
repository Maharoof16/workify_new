
import Image from "next/image";
import FooterImg from "@/assets/footer.png";
import GreetingBanner from "@/modules/dashboard/components/banner";
import TimeHub from "@/modules/dashboard/components/timehub";
import FocusOfTheDay from "@/modules/dashboard/components/focusoftheday";
import { ActionItemsCard } from "@/modules/dashboard/components/action-items";
import ProjectCards, { Project } from "@/modules/dashboard/components/project-cards";
import PerformanceDevelopment from "@/modules/dashboard/components/performance-development";
import ActivitiesCard from "@/modules/dashboard/components/activities";
import { EmployeeFeedCard } from "@/modules/dashboard/components/employeefeed";
import { HolidaysCard } from "@/modules/timehub/holidays/components/holiday-card";
import { LeaveBalanceCard } from "@/modules/timehub/leaves/components/leave-card";
import { SuggestionsCard } from "@/modules/dashboard/components/suggestions";


export const dummyProjects: Project[] = [
  {
    id: "1",
    title: "Workify HRMS Dashboard",
    status: "In Progress",
    priority: "Low",
    createdAt: "2026-05-08T10:00:00Z",
    assignees: [
      {
        id: "u1",
        name: "Maharoof Kp",
      },
      {
        id: "u2",
        name: "Arjun S",
      },
      {
        id: "u3",
        name: "Rahul P",
      },
    ],
  },
  {
    id: "2",
    title: "Attendance Tracking System ",
    status: "Open",
    priority: "Medium",
    createdAt: "2026-05-05T09:30:00Z",
    assignees: [
      {
        id: "u4",
        name: "Akhil R",
      },
      {
        id: "u5",
        name: "Nihal M",
      },
    ],
  },
  {
    id: "3",
    title: "Employee Analytics Portal",
    status: "Completed",
    priority: "High",
    createdAt: "2026-05-01T14:15:00Z",
    assignees: [
      {
        id: "u6",
        name: "Sneha T",
      },
      {
        id: "u7",
        name: "Vishnu K",
      },
      {
        id: "u8",
        name: "Anjali P",
      },
      {
        id: "u9",
        name: "Rohan D",
      },
    ],
  },
  {
    id: "4",
    title: "Timesheet Management",
    status: "On Hold",
    priority: "Low",
    createdAt: "2026-04-28T11:45:00Z",
    assignees: [
      {
        id: "u10",
        name: "Faris A",
      },
      {
        id: "u11",
        name: "Diya S",
      },
    ],
  },
  {
    id: "5",
    title: "Timesheet Management",
    status: "On Hold",
    priority: "Low",
    createdAt: "2026-04-28T11:45:00Z",
    assignees: [
      {
        id: "u10",
        name: "Faris A",
      },
      {
        id: "u11",
        name: "Diya S",
      },
    ],
  },
  {
    id: "6",
    title: "Timesheet Management",
    status: "On Hold",
    priority: "Low",
    createdAt: "2026-04-28T11:45:00Z",
    assignees: [
      {
        id: "u10",
        name: "Faris A",
      },
      {
        id: "u11",
        name: "Diya S",
      },
    ],
  },
  {
    id: "7",
    title: "Timesheet Management",
    status: "On Hold",
    priority: "Low",
    createdAt: "2026-04-28T11:45:00Z",
    assignees: [
      {
        id: "u10",
        name: "Faris A",
      },
      {
        id: "u11",
        name: "Diya S",
      },
    ],
  },
  {
    id: "8",
    title: "Timesheet Management",
    status: "On Hold",
    priority: "Low",
    createdAt: "2026-04-28T11:45:00Z",
    assignees: [
      {
        id: "u10",
        name: "Faris A",
      },
      {
        id: "u11",
        name: "Diya S",
      },
    ],
  },
];

export default function Page() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">
      <div className="xl:col-span-12">
        <GreetingBanner />
      </div>

      <div className="xl:col-span-4">
        <TimeHub />
      </div>

      <div className="xl:col-span-8 flex flex-col gap-5">
        <FocusOfTheDay />
        <ActionItemsCard />
      </div>

      <div className="xl:col-span-4">
        <ProjectCards projects={dummyProjects} />
      </div>

      <div className="xl:col-span-8 flex flex-col gap-5">
        <PerformanceDevelopment />
        <ActivitiesCard />
      </div>

      <div className="xl:col-span-12 grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 flex flex-col gap-6">
          <EmployeeFeedCard />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <HolidaysCard />
            <LeaveBalanceCard variant="dashboard" />
          </div>
        </div>

        <div className="xl:col-span-4">
          <SuggestionsCard />
        </div>
      </div>

      <div className="xl:col-span-12">
        <Image
          src={FooterImg}
          alt="Leave Policy"
          className="w-full object-cover"
        />
      </div>
    </div>
  );
}
