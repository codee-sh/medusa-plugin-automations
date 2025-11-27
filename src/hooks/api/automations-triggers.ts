import { FetchError } from "@medusajs/js-sdk"
import {
  QueryKey,
  useQuery
} from "@tanstack/react-query"
import { sdk } from "../../admin/lib/sdk"

export type UseListAutomationsTriggersParams = {
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

export const useListAutomationsTriggers = (
  params: any,
  options?: any
) => {
  const { limit = 100, offset = 0, extraKey = [], enabled, fields, order = "created_at", id } = params;

  const queryKey: QueryKey = [
    "automations-triggers", 
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
  
  // if (resource_type) {
  //   query.resource_type = resource_type;
  // }

  const { data, ...rest } = useQuery<
    ListAutomationsTriggersQueryData,
    FetchError,
    ListAutomationsTriggersQueryData,
    QueryKey
  >({
    queryKey,
    queryFn: async () => {
      return await sdk.client.fetch("/admin/mpn/automations/list", {
        method: "GET",
        query,
      })
    },
    enabled,
    ...(options as any),
  });

  return { data, ...rest };
};
