import { FetchError } from "@medusajs/js-sdk"
import {
  QueryKey,
  useQuery,
  useMutation,
} from "@tanstack/react-query"
import { sdk } from "../../../admin/lib/sdk"

export type useAutomationsActionsDataParams = {
  extraKey?: unknown[]
  enabled?: boolean
}

type AutomationsActionsDataQueryData = {
  dynamicData: any
}

export const useAutomationsActionsData = (
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
    "automations-actions-data",
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

  const { data, ...rest } = useQuery<
    AutomationsActionsDataQueryData,
    FetchError,
    AutomationsActionsDataQueryData,
    QueryKey
  >({
    queryKey,
    queryFn: async () => {
      return await sdk.client.fetch(
        "/admin/mpn/automations/actions/data",
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
