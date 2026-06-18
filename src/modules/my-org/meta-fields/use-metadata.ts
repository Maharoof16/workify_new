import { useService } from "@/hooks/use-service";
import { MetadataService } from "./metadata.service";

export function useMetadata(options?: { enableReference?: boolean }) {
  return useService("metadata", new MetadataService(), options);
}