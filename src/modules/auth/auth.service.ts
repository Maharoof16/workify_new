import axiosInstance from "@/lib/axios-instance";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export class AuthService {

    static async signIn({
    identifier,
    password,
  }: {
    identifier: string;
    password: string;
  }) {
    const response = await axiosInstance.post("/auth/sign-in", {
      identifier,
      password,
    });

    return response.data;
  }

    static async logout() {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  }

   static async me() {
    const response = await axiosInstance.get("/auth/me");
    return response.data.data;
  }

   static async generateSSOURL() {
    const response = await axiosInstance.get("/auth/microsoft-sso");
    return response.data.data;
  }

   static async myPermissions(){
    const response=await axiosInstance.get("auth/me/permissions");
    return response.data.data;
  }
}
