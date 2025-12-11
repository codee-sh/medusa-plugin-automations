import { FetchError } from "@medusajs/js-sdk"
import { QueryKey, useQuery } from "@tanstack/react-query"
import { sdk } from "../../../admin/lib/sdk"

export type useAvailableEventsParams = {
  id?: string
}

export type AvailableEventsQueryData = {
  events: {
    name: string
    events: {
      value: string
      label: string
      attributes?: Array<{ value: string; label: string }>
      templates?: Array<{ value: string; name: string }>
      contextType?: string | null
      id?: string
      group?: string
      field_type?: string
    }[]
  }[]
}

export const useAvailableEvents = (
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
    "available-events",
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
    AvailableEventsQueryData,
    FetchError,
    AvailableEventsQueryData,
    QueryKey
  >({
    queryKey,
    queryFn: async () => {
      return await sdk.client.fetch(
        "/admin/mpn/automations/available-events",
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
