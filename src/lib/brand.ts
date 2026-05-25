import { ToasterProps } from "sonner";

// lib/brands.ts
export type BrandTheme = {
  label?: string;
  loginPageText?: string;
  primary?: string;
  primaryForeground?: string;
  secondary?: string;
  secondaryForeground?: string;
  accent?: string;
  accentForeground?: string;
  bannerImageUrl?: string;
  faviconUrl?: string;
  toastPosition?: ToasterProps["position"];
};

export const BRAND_THEMES: Record<string, BrandTheme> = {
//   csod: {
//     label: "CSOD",
//     loginPageText: "Welcome Back",
//     primary: "#fa4616",
//     primaryForeground: "#ffffff",
//     secondary: "#ffe6dc",
//     secondaryForeground: "#fa4616",
//     bannerImageUrl: "/assets/csod-banner-2.png",
//     faviconUrl: "/csod-favicon.png",
//   },
//   acme: {
//     label: "VTrack",
//     loginPageText: "Welcome to VTrack",
//     primary: "#5090f8",
//     primaryForeground: "#ffffff",
//     secondary: "#dbeafe",
//     secondaryForeground: "#5090f8",
//     toastPosition: "top-center",
//     faviconUrl: "https://www.vithiit.com/assets/logo.png"
//   },
//   globex: {
//     label: "Globex",
//     loginPageText: "Welcome to Globex",
//     primary: "#16a34a",
//     primaryForeground: "#ffffff",
//     secondary: "#dcfce7",
//     secondaryForeground: "#16a34a",
//   },
};

export const brand = BRAND_THEMES["csod"];