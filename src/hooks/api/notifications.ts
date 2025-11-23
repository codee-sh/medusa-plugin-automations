import { FetchError } from "@medusajs/js-sdk"
import {
  QueryKey,
  useQuery
} from "@tanstack/react-query"
import { sdk } from "../../admin/lib/sdk"

export type UseListNotificationsParams = {
  resource_id?: string;
  resource_type?: string;
  limit?: number;
  offset?: number;
  extraKey?: unknown[];
  enabled?: boolean;
  fields?: string;
  order?: string;
};

type ListNotificationsQueryData = {
  notifications: any;
  count: number;
  limit: number;
  offset: number;
};

export const useListNotifications = (
  params: any,
  options?: any
) => {
  const { limit = 100, offset = 0, extraKey = [], enabled, fields, order = "created_at", resource_id, resource_type } = params;

  const queryKey: QueryKey = [
    "notifications", 
    resource_id,
    resource_type,
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

  if (resource_id) {
    query.resource_id = resource_id;
  }
  
  if (resource_type) {
    query.resource_type = resource_type;
  }

  const { data, ...rest } = useQuery<
    ListNotificationsQueryData,
    FetchError,
    ListNotificationsQueryData,
    QueryKey
  >({
    queryKey,
    queryFn: async () => {
      return await sdk.client.fetch("/admin/notification-plugin/notifications", {
        method: "GET",
        query,
      })
    },
    enabled,
    ...(options as any),
  });

  return { data, ...rest };
};
