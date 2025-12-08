import { FetchError } from "@medusajs/js-sdk"
import { QueryKey, useQuery } from "@tanstack/react-query"
import { sdk } from "../../../admin/lib/sdk"

export type AvailableActionsQueryData = {
  actions: {
    enabled: any
    value: string
    label: string
    description?: string
    metadata?: any
    configComponentKey?: string
    fields?: Array<{
      name: string
      key: string
      label: string
      type: string
      required?: boolean
      placeholder?: string
    }>
  }[]
}

export const useAvailableActions = (
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
    "available-actions",
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
    AvailableActionsQueryData,
    FetchError,
    AvailableActionsQueryData,
    QueryKey
  >({
    queryKey,
    queryFn: async () => {
      return await sdk.client.fetch(
        "/admin/mpn/automations/available-actions",
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
