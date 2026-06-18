import { useService } from "@/hooks/use-service";
import { TaskService } from "./task.service";

export function useTask(options?: { enableReference?: boolean }) {
  return useService("task", new TaskService(), options);
}