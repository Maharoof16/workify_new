import { useService } from "@/hooks/use-service";
import { UseQueryOptions } from "@tanstack/react-query";
import { EntityLabelService } from "./entity-labels.services";
import { TEntityLabel } from "./entitylabel";


export function useEntityLabel() {
  const {
    list,
    loading,
    create,
    creating,
    update,
    updating,
    remove,
    removing,
    query,
    error,
    service,
  } = useService("entity-labels", new EntityLabelService());

  function useById(
    id: string,
    options?: Omit<
      UseQueryOptions<
        TEntityLabel,
        import("axios").AxiosError,
        TEntityLabel,
        readonly unknown[]
      >,
      "queryKey" | "queryFn"
    > & { key?: string }
  ) {
    return query("getById", [id], {
      ...options,
      key: `entity-label-${id}`,
      enabled: false,
    });
  }

  return {
    list,
    loading,
    create,
    creating,
    update,
    updating,
    remove,
    removing,
    query,
    error,
    service,
    useById,
  };
}
