import axiosInstance from "@/lib/axios-instance";
import {
  ApproveReject,
  CreateTimesheet,
  MultipleEntries,
  TimeSheetReportItem,
} from "./timesheet";

export class TimesheetService {
  static async getbyperiod(
    periodStart: string,
    periodEnd: string,
    signal?: AbortSignal,
  ) {
    const response = await axiosInstance.get(
      `time-sheet/period?periodStart=${periodStart}&periodEnd=${periodEnd}`,
      { signal },
    );

    return {
      data: response.data.data,
    };
  }

  static async saveOrSubmit(data: CreateTimesheet) {
    const response = await axiosInstance.post("/time-sheet", data);
    return response.data.data;
  }

  static async listTimesheets(
    periodStart?: string,
    periodEnd?: string,
    page = 1,
    limit = 10,
    signal?: AbortSignal,
  ) {
    const response = await axiosInstance.get(
      `/time-sheet?periodStart=${periodStart}&periodEnd=${periodEnd}&page=${page}&limit=${limit}`,
      {
        signal,
      },
    );

    return {
      data: response.data.data.entries,
      pagination: response.data.data.pagination,
    };
  }

  static async getById(id: string) {
    const response = await axiosInstance.get(`/time-sheet/${id}`);
    return response.data.data;
  }

  static async approveOrRejectAll(id: string, data: ApproveReject) {
    const response = await axiosInstance.put(
      `/time-sheet/${id}/approve-reject`,
      data,
    );
    return response.data.data;
  }

  static async approveOrRejectEntry(id: string, data: ApproveReject) {
    const response = await axiosInstance.put(
      `/time-sheet/time-entry/${id}/approve-reject`,
      data,
    );
    return response.data.data;
  }

  static async unlockTimesheet(id: string, data: { type: "APPROVE" }) {
    const response = await axiosInstance.put(`/time-sheet/${id}/unlock`, data);
    return response.data.data;
  }

  static async getTimesheetReport(
    periodStart: string,
    periodEnd: string,
    options?: {
      employeeId?: string;
      projectId?: string;
      departmentId?: string;
    },
  ): Promise<TimeSheetReportItem[]> {
    const params: Record<string, string> = {
      startDate: periodStart,
      endDate: periodEnd,
    };

    if (options?.employeeId) params.employeeId = options.employeeId;
    if (options?.projectId) params.projectId = options.projectId;
    if (options?.departmentId) params.departmentId = options.departmentId;

    const response = await axiosInstance.get(`/reports/timesheet`, {
      params,
    });

    return response.data.data;
  }

  static async createMultipleEntries(data: MultipleEntries) {
    const response = await axiosInstance.post("/time-sheet/time-entry", data);
    return response.data.data;
  }


  static async deleteEntry(id: string) {
    const response = await axiosInstance.delete(`/time-sheet/time-entry/delete/${id}`);
    return response.data.data;
  }
}
