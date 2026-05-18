import axiosInstance from "@/lib/axios-instance";
import { TFocusItem } from "./dashboard";
import profile from "@/assets/profile.png"

const mockFocusData: TFocusItem[] = [
   {
    id:"1",
    title: "Leave request from Priya Sharma",
    subtitle: "Casual Leave, Mar 12-14",
    image: profile,
    actions: "leave",
  },
  {
    id:'2',
    title: "Complete Q1 Performance Review",
    subtitle: "Due Mar 15",
    image: profile,
    actions: "priority",
  },
  {
    id:'3',
    title: "Frontend Developer - Round 2",
    subtitle: "Scheduled Mar 11, 3:00 PM",
    image: profile,
    actions: "meeting",
  },
];

export class DashboardService {
   static async getLocationAndWeather(lat: number, lon: number) {
    const [locRes, weatherRes] = await Promise.all([
      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      ).then((res) => res.json()),
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      ).then((res) => res.json()),
    ]);

    return {
      location: locRes.city || locRes.locality || "Unknown",
      temperature: weatherRes?.current_weather?.temperature ?? null,
    };
  }
  static async getFocus(): Promise<TFocusItem[]> {
     return Promise.resolve(mockFocusData);
  
    // const response = await axiosInstance.get("/dashboard/focus");
  
    // return response.data.data
  }
}

