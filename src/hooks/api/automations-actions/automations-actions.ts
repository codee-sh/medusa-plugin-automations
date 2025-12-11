import { FetchError } from "@medusajs/js-sdk"
import {
  QueryKey,
  useQuery,
  useMutation,
} from "@tanstack/react-query"
import { sdk } from "../../../admin/lib/sdk"

export const useEditAutomationAction = () => {
  return useMutation<void, FetchError, Record<string, any>>(
    {
      mutationFn: async (data) => {
        await sdk.client.fetch(
          "/admin/mpn/automations/actions",
          {
            method: "POST",
            body: data,
          }
        )
      },
    }
  )
}

export type useListAutomationsActionsParams = {
  id?: string
  trigger_id?: string
  limit?: number
  offset?: number
  extraKey?: unknown[]
  enabled?: boolean
  fields?: string
  order?: string
}

type ListAutomationsActionsQueryData = {
  actions: any
  count: number
  limit: number
  offset: number
}

export const useListAutomationsActions = (
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
    trigger_id,
  } = params

  const queryKey: QueryKey = [
    "automations-actions",
    ...extraKey,
  ]

  const query: any = {
    limit,
    offset,
    fields,
    order,
  }

  if (id) {
    query.id = id
  }

  if (trigger_id) {
    query.trigger_id = trigger_id
  }

  const { data, ...rest } = useQuery<
    ListAutomationsActionsQueryData,
    FetchError,
    ListAutomationsActionsQueryData,
    QueryKey
  >({
    queryKey,
    queryFn: async () => {
      return await sdk.client.fetch(
        "/admin/mpn/automations/actions",
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
