import { FetchError } from "@medusajs/js-sdk"
import {
  QueryKey,
  useQuery,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query"
import { sdk } from "../../../admin/lib/sdk"


export const useCreateAutomation = (options?: any) => {
  return useMutation<void, FetchError, Record<string, any>>({
    mutationFn: async (data) => {
      await sdk.client.fetch("/admin/mpn/automations", {
        method: "POST",
        body: data,
      });
    },
  });
};

export const useEditAutomation = (options?: any) => {
  return useMutation<void, FetchError, Record<string, any>>({
    mutationFn: async (data) => {
      await sdk.client.fetch("/admin/mpn/automations", {
        method: "POST",
        body: data,
      });
    },
  });
};

export type DeleteAutomationInput = {
  id: string;
};

export const useDeleteAutomation = (
  options?: UseMutationOptions<void, FetchError, DeleteAutomationInput>
) => {
  return useMutation<void, FetchError, DeleteAutomationInput>({
    mutationFn: async ({ id }) => {
      await sdk.client.fetch("/admin/mpn/automations", {
        method: "DELETE",
        body: {
          id: id,
        },
      });
    },
    ...(options as any),
  });
};


export type useListAutomationsParams = {
  id?: string;
  limit?: number;
  offset?: number;
  extraKey?: unknown[];
  enabled?: boolean;
  fields?: string;
  order?: string;
};

type ListAutomationsTriggersQueryData = {
  triggers: any;
  count: number;
  limit: number;
  offset: number;
};

export const useListAutomations = (
  params: any,
  options?: any
) => {
  const { limit = 100, offset = 0, extraKey = [], enabled, fields, order = "created_at", id } = params;

  const queryKey: QueryKey = [
    "automations", 
    id,
    limit,
    offset,
    ...extraKey
  ];
  
  const query: any = {
    limit,
    offset,
    fields,
    order,
  };

  if (id) {
    query.id = id;
  }
  
  const { data, ...rest } = useQuery<
    ListAutomationsTriggersQueryData,
    FetchError,
    ListAutomationsTriggersQueryData,
    QueryKey
  >({
    queryKey,
    queryFn: async () => {
      return await sdk.client.fetch("/admin/mpn/automations", {
        method: "GET",
        query,
      })
    },
    enabled,
    ...(options as any),
  });

  return { data, ...rest };
};
