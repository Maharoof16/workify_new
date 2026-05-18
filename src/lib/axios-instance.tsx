// lib/axios-instance.ts

import axios from "axios";
import { toast } from "sonner";
import { STOP_TOAST_ON_ROUTE } from "./config";

const isServer = typeof window === "undefined";

const axiosInstance = axios.create({
  baseURL: isServer
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : "/api",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  config.withCredentials = true;

  if (typeof window !== "undefined") {
    config.headers["x-origin"] = window.location.origin;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    const url = error.config?.url || "";
    const status = error.response?.status;

    if (url && !STOP_TOAST_ON_ROUTE.includes(url)) {

      // Uncomment when auth/login flow is added
      // if (status === 401) {
      //   toast.error(
      //     error.response?.data?.message ||
      //       error.message ||
      //       "Unauthorized access - please log in again.",
      //   );

      //   if (
      //     !url.includes("/auth/sign-in") &&
      //     !url.includes("/users/user")
      //   ) {
      //     window.location.href = "/";
      //   }
      // }

      if (status === 403) {
        toast.error(
          "Forbidden - you do not have permission to access this resource.",
        );
      } else if (error.code === "ECONNABORTED") {
        toast.error("Request timed out - please try again.");
      } else {
        toast.error(
          error.response?.data?.details?.[0]?.error ||
            error.response?.data?.message ||
            error.message ||
            "An error occurred while processing your request.",
        );
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;