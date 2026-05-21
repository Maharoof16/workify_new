import axiosInstance from "@/lib/axios-instance";
import { TFocusItem } from "./dashboard";
import { activities, EmployeeFeedData, mockFocusData, performanceCards } from "./dashboard.mock";
import { mockApi } from "@/lib/mock-api";


const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export class DashboardService {
  static async getLocationAndWeather(lat: number, lon: number) {
    const [locRes, weatherRes] = await Promise.all([
      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      ).then((res) => res.json()),
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
      ).then((res) => res.json()),
    ]);

    return {
      location: locRes.city || locRes.locality || "Unknown",
      temperature: weatherRes?.current_weather?.temperature ?? null,
    };
  }
  static async getFocus() {
  if (USE_MOCK_API) {
    const response = await mockApi(mockFocusData);

    return response.data.data;
  }

  const response = await axiosInstance.get(
    `/dashboard/get-focus`,
  );

  return response.data.data;
}

static async getActivities() {
  if (USE_MOCK_API) {
    const response = await mockApi(activities);

    return response.data.data;
  }

  const response = await axiosInstance.get(
    `/dashboard/get-activities`,
  );

  return response.data.data;
}

  static async getEmployeeFeed() {
    if (USE_MOCK_API) {
      const response = await mockApi(EmployeeFeedData);

      return response.data.data;
    }

    const response = await axiosInstance.get(`/dashboard/employee-feed`);

    return response.data.data;
  }

  static async getPerformanceDevelopment() {
  if (USE_MOCK_API) {
    const response = await mockApi(performanceCards);

    return response.data.data;
  }

  const response = await axiosInstance.get(
    `/dashboard/performance-development`,
  );

  return response.data.data;
}
}
