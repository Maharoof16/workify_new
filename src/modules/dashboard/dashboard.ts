import { StaticImageData } from "next/image";

export type FocusAction = "leave" | "priority" | "meeting";

export interface TFocusItem {
  id: string;
  title: string;
  subtitle: string;
  image: string | StaticImageData;
  actions: FocusAction;
}

export type EmployeeFeed = {
  id: string;
  title: string;
  tag?: string;
  description: string;
  imageUrl: string | StaticImageData;
  createdAt: string;
};
