import { FetchError } from "@medusajs/js-sdk"
import {
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query"
import { sdk } from "../../admin/lib/sdk"

export type UseEventsParams = {
  name?: string
  data?: any
}

type EventsMutationData = {
  success: boolean
  message: string
  eventName: string
  eventData: any
}

type EventsMutationVariables = {
  name: string
  data: any
}

export const useEvents = (
  options?: Omit<
    UseMutationOptions<
      EventsMutationData,
      FetchError,
      EventsMutationVariables
    >,
    "mutationFn"
  >
) => {
  const { data: eventsData, mutate, mutateAsync, ...rest } = useMutation<
    EventsMutationData,
    FetchError,
    EventsMutationVariables
  >({
    mutationFn: async (variables) => {
      return await sdk.client.fetch("/admin/mpn/events", {
        method: "POST",
        body: {
          name: variables.name,
          data: variables.data,
        },
      })
    },
    ...(options as any),
  })

  return { 
    data: eventsData, 
    mutate, 
    mutateAsync,
    ...rest 
  }
}
