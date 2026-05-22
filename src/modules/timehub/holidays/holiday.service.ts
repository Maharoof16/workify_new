import axiosInstance from "@/lib/axios-instance";
import { mockApi } from "@/lib/mock-api";
import { Holiday } from "./holiday";
import { HolidaysData } from "./holiday.mock";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export class HolidayService {
 static async getAll(): Promise<Holiday[]> {
    if (USE_MOCK_API) {
      const response = await mockApi(HolidaysData);
      return response.data.data;
    }

    const response = await axiosInstance.get(`/timehub/holidays`);

    return response.data.data.holidays;
  }

}
