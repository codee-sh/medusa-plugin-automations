import { FetchError } from "@medusajs/js-sdk"
import {
  QueryKey,
  useQuery,
  useMutation
} from "@tanstack/react-query"
import { sdk } from "../../../admin/lib/sdk"

export const useEditAutomationRule = () => {
  return useMutation<void, FetchError, Record<string, any>>({
    mutationFn: async (data) => {
      await sdk.client.fetch("/admin/mpn/automations/rules", {
        method: "POST",
        body: data,
      });
    },
  });
};

export type useListAutomationsRulesParams = {
  id?: string;
  trigger_id?: string;
  limit?: number;
  offset?: number;
  extraKey?: unknown[];
  enabled?: boolean;
  fields?: string;
  order?: string;
};

type ListAutomationsRulesQueryData = {
  rules: any;
  count: number;
  limit: number;
  offset: number;
};

export const useListAutomationsRules = (
  params: any,
  options?: any
) => {
  const { limit = 100, offset = 0, extraKey = [], enabled, fields, order = "created_at", id, trigger_id } = params;

  const queryKey: QueryKey = [
    "automations-rules", 
    id,
    trigger_id,
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
  
  if (trigger_id) {
    query.trigger_id = trigger_id;
  }
  
  const { data, ...rest } = useQuery<
    ListAutomationsRulesQueryData,
    FetchError,
    ListAutomationsRulesQueryData,
    QueryKey
  >({
    queryKey,
    queryFn: async () => {
      return await sdk.client.fetch("/admin/mpn/automations/rules", {
        method: "GET",
        query,
      })
    },
    enabled,
    ...(options as any),
  });

  return { data, ...rest };
};
