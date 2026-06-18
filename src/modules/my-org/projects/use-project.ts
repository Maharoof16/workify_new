import { useService } from "@/hooks/use-service";
import { ProjectService } from "./project.service";

export function useProject(options?: { enableReference?: boolean }) {
  return useService("project", new ProjectService(), options);
}