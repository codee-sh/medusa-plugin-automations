import { FetchError } from "@medusajs/js-sdk"
import { QueryKey, useQuery } from "@tanstack/react-query"
import { sdk } from "../../../admin/lib/sdk"

export type AvailableTriggersQueryData = {
  triggers: { value: string; label: string }[]
}

export const useAvailableTriggers = (
  params: any,
  options?: any
) => {
  const {
    limit = 100,
    offset = 0,
    extraKey = [],
    enabled,
    fields,
    order = "created_at",
    id,
  } = params

  const queryKey: QueryKey = [
    "available-triggers",
    limit,
    offset,
    ...extraKey,
  ]

  const query: any = {
    limit,
    offset,
    fields,
    order,
  }

  const { data, ...rest } = useQuery<
    AvailableTriggersQueryData,
    FetchError,
    AvailableTriggersQueryData,
    QueryKey
  >({
    queryKey,
    queryFn: async () => {
      return await sdk.client.fetch(
        "/admin/mpn/automations/available-triggers",
        {
          method: "GET",
          query,
        }
      )
    },
    enabled,
    ...(options as any),
  })

  return { data, ...rest }
}
