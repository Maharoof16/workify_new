import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useMemo } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncFn = (...args: any[]) => Promise<any>;

type ServiceShape<T = unknown> = {
  [K in keyof T as T[K] extends AsyncFn ? K : never]: T[K];
} & {
  [key: string]: AsyncFn;
};

/**
 * Helper conditional types
 */
type ListType<T> = T extends {
  getAll: (...args: unknown[]) => Promise<infer R>;
}
  ? R
  : unknown;

type CreateArg<T> = T extends { create: (arg: infer A) => Promise<unknown> }
  ? A
  : never;

type CreateReturn<T> = T extends {
  create: (...args: unknown[]) => Promise<infer R>;
}
  ? R
  : unknown;

type UpdateArgs<T> = T extends {
  update: (id: infer I, data: infer D) => Promise<unknown>;
}
  ? [I, D]
  : never;

type UpdateReturn<T> = T extends {
  update: (...args: unknown[]) => Promise<infer R>;
}
  ? R
  : unknown;

type DeleteArgs<T> = T extends {
  delete: (id: infer I) => Promise<unknown>;
}
  ? [I]
  : never;

type DeleteReturn<T> = T extends {
  delete: (...args: unknown[]) => Promise<infer R>;
}
  ? R
  : unknown;

/**
 * Hook
 */
export function useService<T extends object>(
  queryKey: string,
  rawService: T,
  options?: {
    enableReference?: boolean;
  }
) {
  const service = rawService as ServiceShape<T>;
  const queryClient = useQueryClient();

  // List query
  const listQuery = useQuery<ListType<T>>({
    queryKey: [queryKey],
    queryFn: () =>
      "getAll" in service
        ? (service.getAll as AsyncFn)()
        : Promise.resolve(undefined),
    enabled: "getAll" in service,
    staleTime: 30 * 60 * 1000,
    // retry(failureCount, error) {
    //   if (
    //     (error as AxiosError)?.status === 401 ||
    //     (error as AxiosError)?.status === 403
    //   ) {
    //     return false;
    //   }
    //   return failureCount < 1;
    // },
  });

  // Create mutation
  const createMutation = useMutation<CreateReturn<T>, unknown, CreateArg<T>>({
    mutationFn: (data) => {
      if ("create" in service) {
        return (service.create as AsyncFn)(data);
      }
      return Promise.reject(new Error("Create not implemented"));
    },
    // onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
    onSuccess: (newData) => {
      queryClient?.setQueryData<ListType<T>>([queryKey], (oldData) => {
        if (!oldData) {
          return [newData] as unknown as ListType<T>;
        }
        return [
          ...(oldData as unknown as any[]),
          newData,
        ] as unknown as ListType<T>;
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation<
    UpdateReturn<T>,
    unknown,
    { id: UpdateArgs<T>[0]; data: UpdateArgs<T>[1] }
  >({
    mutationFn: ({ id, data }) =>
      service.update?.(id, data) as Promise<UpdateReturn<T>>,
    onSuccess: (_data, variables) => {
      // queryClient.invalidateQueries({ queryKey: [queryKey] });
      // Generic case
      const previousList = queryClient.getQueryData<ListType<T>>([queryKey]);
      if (previousList) {
        const updatedList = (previousList as { id: unknown }[]).map((item) =>
          item.id == variables.id &&
            typeof item === "object" &&
            typeof _data === "object"
            ? { ...item, ..._data }
            : item,
        );
        queryClient.setQueryData([queryKey], updatedList);
      }
    },
  });

  // Delete mutation
  const deleteMutation = useMutation<
    DeleteReturn<T>,
    unknown,
    DeleteArgs<T>[0]
  >({
    mutationFn: (id) => {
      if (!("delete" in service) || typeof service.delete !== "function") {
        return Promise.reject(new Error("Delete method not implemented"));
      }
      return service.delete(id) as Promise<DeleteReturn<T>>;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
  });

  // Generic query wrapper
  function useServiceQuery<M extends keyof typeof service>(
    method: M,
    // args: Parameters<(typeof service)[M]>,
    args: unknown[],

    options?: Omit<
      UseQueryOptions<
        Awaited<ReturnType<(typeof service)[M]>>,
        AxiosError,
        Awaited<ReturnType<(typeof service)[M]>>
      >,
      "queryKey" | "queryFn"
    > & { key?: string },
  ) {
    const fn = service[method] as AsyncFn;
    const key = options?.key ?? `${String(method)}-${JSON.stringify(args)}`;

    return useQuery<Awaited<ReturnType<(typeof service)[M]>>, AxiosError>({
      queryKey: [queryKey, key],
      queryFn: () => fn(...args),
      ...options,
    });
  }

  const enableReference = options?.enableReference ?? true;
  const hasReference = "getReferenceList" in service;

  const referenceQuery = useServiceQuery(
    "getReferenceList" as any,
    [],
    {
      key: "reference-list",
      staleTime: Infinity,
      enabled: hasReference && enableReference,
    }
  );

  function getByIdFn(id: string | number) {
    const key = [queryKey, `by-id-${id}`];

    const cached = queryClient.getQueryData(key);
    if (cached) return Promise.resolve(cached);

    const fn = service["getById"] as (id: string) => Promise<any>;

    return fn(String(id)).then((data) => {
      queryClient.setQueryData(key, data);
      return data;
    });
  }

  const list = useMemo(() => listQuery.data ?? [], [listQuery.data]);

  return {
    // CRUD
    list,
    loading: listQuery.isLoading,
    error: listQuery.error,
    refetch: listQuery.refetch,

    create: service.create ? createMutation.mutate : undefined,
    creating: createMutation.isPending,

    update: service.update ? updateMutation.mutate : undefined,
    updating: updateMutation.isPending,

    remove: service.delete ? deleteMutation.mutate : undefined,
    removing: service.delete ? deleteMutation.isPending : undefined,

    // Generic query runner
    query: useServiceQuery,

    getById: getByIdFn,


    referenceList: referenceQuery.data,
    referenceLoading: referenceQuery.isLoading,

    // Raw service
    service,
  };
}
