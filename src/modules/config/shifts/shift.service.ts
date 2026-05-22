import axiosInstance from "@/lib/axios-instance";
import { mockApi } from "@/lib/mock-api";
import { shifts } from "./shift.mock";
import { Shift } from "./shift";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export class ShiftService {
  static async getAll(): Promise<Shift[]> {
    if (USE_MOCK_API) {
      const response = await mockApi(shifts);

      return response.data.data;
    }

    const response = await axiosInstance.get(`/shifts`);

    return response.data.data.shifts;
  }
}
