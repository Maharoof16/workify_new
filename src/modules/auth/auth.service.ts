import axiosInstance from "@/lib/axios-instance";

import { mockApi } from "@/lib/mock-api";
import { currentUserMock } from "../members/users/users.mock";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export class AuthService {
  static async me() {
    if (USE_MOCK_API) {
      const response = await mockApi(currentUserMock);

      return response.data.data;
    }

    const response = await axiosInstance.get("/auth/me");

    return response.data.data;
  }
}
