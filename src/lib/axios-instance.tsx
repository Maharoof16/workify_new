import { STOP_TOAST_ON_ROUTE } from "@/lib/config";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
 
const isServer = typeof window === "undefined";
 
type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};
 
const axiosInstance = axios.create({
  baseURL: isServer ? process.env.NEXT_PUBLIC_API_BASE_URL : "/v1",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    "x-org-domain": process.env.NEXT_PUBLIC_ORGANIZATION_SLUG,
    // "ngrok-skip-browser-warning": "true"
  },
});
 
let isRefreshing = false;
let refreshFailed = false;
const AUTH_EXCLUDED_ROUTES = [
  "/auth/sign-in",
  "/auth/me",
  "/users/user",
  "/auth/refresh",
];
 
let failedQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];
 
const processQueue = (error: unknown = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
 
  failedQueue = [];
};
 
const refreshClient = axios.create({
  baseURL: isServer ? process.env.NEXT_PUBLIC_API_BASE_URL : "/v1",
  timeout: 20000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "x-org-domain": process.env.NEXT_PUBLIC_ORGANIZATION_SLUG,
  },
});
 
refreshClient.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    config.headers["x-origin"] = window.location.origin;
  } else {
    const { headers } = await import("next/headers");
    const headersList = await headers();
    const realIp =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip");
 
    if (realIp) {
      config.headers["x-forwarded-for"] = realIp;
    }
  }
 
  return config;
});
 
const refreshSession = async () => {
  await refreshClient.post("/auth/refresh");
};
 
axiosInstance.interceptors.request.use(async (config) => {
  config.withCredentials = true;
 
  if (typeof window !== "undefined") {
    // Client-side
    config.headers["x-origin"] = window.location.origin;
  } else {
    // Server-side: forward the real client IP
    const { headers } = await import("next/headers");
    const headersList = await headers();
    const realIp =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip");
 
    if (realIp) {
      config.headers["x-forwarded-for"] = realIp;
    }
  }
 
  return config;
});
 
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    if (error.code === "ERR_CANCELED" || error.message === "canceled") {
      return Promise.reject(error);
    }
 
    const originalRequest = error.config as RetryableConfig;
    const url = originalRequest?.url || "";
    const status = error.response?.status;
 
    const backendCode =
      error.response?.data?.errors?.[0]?.code || error.response?.data?.code;
 
    const backendMessage =
      error.response?.data?.errors?.[0]?.message ||
      error.response?.data?.message;
 
    const isExcluded = AUTH_EXCLUDED_ROUTES.some((route) =>
      url.includes(route),
    );
 
    if (refreshFailed && status === 401) {
      return Promise.reject(error);
    }
 
    const isTokenExpired =
      status === 401 &&
      backendCode === "TOKEN_EXPIRED" &&
      !originalRequest?._retry &&
      !url.includes("/auth/refresh") &&
      !isExcluded;
 
    if (isTokenExpired) {
      originalRequest._retry = true;
 
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axiosInstance(originalRequest)),
            reject,
          });
        });
      }
 
      isRefreshing = true;
 
      try {
        await refreshSession();
        refreshFailed = false;
        processQueue();
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        refreshFailed = true;
        processQueue(refreshError);
 
        if (typeof window !== "undefined") {
          toast.error("Session expired. Please sign in again.");
 
          const isAlreadyOnSignIn = window.location.pathname === "/";
          if (!isAlreadyOnSignIn) {
            window.location.replace("/");
          }
        }
 
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
 
    if (url && !STOP_TOAST_ON_ROUTE.includes(url)) {
      if (status === 401) {
        if (!isExcluded && typeof window !== "undefined") {
          toast.error(
            backendMessage || "Unauthorized access - please log in again.",
          );
 
          const isAlreadyOnSignIn = window.location.pathname === "/";
          if (!isAlreadyOnSignIn) {
            window.location.replace("/");
          }
        }
      } else if (status === 403) {
        toast.error(
          backendMessage ||
          "You do not have permission to perform this action.",
        );
      } else if (error.code === "ECONNABORTED") {
        toast.error("Request timed out - please try again.");
      } else {
        toast.error(
          backendMessage ||
          error.message ||
          "An error occurred while processing your request.",
        );
      }
    }
 
    return Promise.reject(error);
  },
);
 
export default axiosInstance;