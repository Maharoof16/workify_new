"use client";
import Image from "next/image";
import FooterImg from "@/assets/footer.png";
import GreetingBanner from "@/modules/dashboard/components/banner";
import TimeHub from "@/modules/dashboard/components/timehub";
import FocusOfTheDay from "@/modules/dashboard/components/focusoftheday";
import { ActionItemsCard } from "@/modules/dashboard/components/action-items";
import ProjectCards from "@/modules/dashboard/components/project-cards";
import PerformanceDevelopment from "@/modules/dashboard/components/performance-development";
import ActivitiesCard from "@/modules/dashboard/components/activities";
import { EmployeeFeedCard } from "@/modules/dashboard/components/employeefeed";
import { HolidaysCard } from "@/modules/timehub/holidays/components/holiday-card";
import { LeaveBalanceCard } from "@/modules/timehub/leaves/components/leave-card";
import { SuggestionsCard } from "@/modules/dashboard/components/suggestions";
import { useEffect, useState } from "react";
import { ProjectService } from "@/modules/my-org/projects/project.service";
import { StatusService } from "@/modules/config/status/status.service";
import { PriorityService } from "@/modules/config/priorities/priorities.service";
import { GlobalOption } from "@/modules/config/config";
import { Project } from "@/modules/my-org/projects/project";

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [statuses, setStatuses] = useState<GlobalOption[]>([]);
  const [priorities, setPriorities] = useState<GlobalOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [projectRes, statusRes, priorityRes] = await Promise.all([
        ProjectService.getAll(),
        StatusService.getAll(),
        PriorityService.getAll(),
      ]);

      setProjects(projectRes.data.data);
      setStatuses(statusRes.data.data);
      setPriorities(priorityRes.data.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 w-full">
      <div className="xl:col-span-12">
        <GreetingBanner />
      </div>

      <div className="xl:col-span-4">
        <TimeHub />
      </div>

      <div className="xl:col-span-8 flex flex-col gap-4">
        <FocusOfTheDay />
        <ActionItemsCard />
      </div>

      <div className="xl:col-span-4">
        <ProjectCards
          projects={projects}
          statuses={statuses}
          priorities={priorities}
          loading={loading}
        />
      </div>

      <div className="xl:col-span-8 flex flex-col gap-4">
        <PerformanceDevelopment />
        <ActivitiesCard />
      </div>

      <div className="xl:col-span-12 grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-8 flex flex-col gap-4">
          <EmployeeFeedCard />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
