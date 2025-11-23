import { HttpTypes } from "@medusajs/framework/types"
import { FetchError } from "@medusajs/js-sdk"
import {
  QueryKey,
  useQuery,
  UseQueryOptions,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query"
import { sdk } from "../../admin/lib/sdk"

export type UsePreviewParams = {
  templateName?: string
  templateData?: any
  locale?: string
  extraKey?: unknown[]
  enabled?: boolean
}

type PreviewQueryData = {
  html: string
  text: string
}

export const usePreview = (
  params: UsePreviewParams,
  options?: Omit<
    UseQueryOptions<
      PreviewQueryData,
      FetchError,
      PreviewQueryData,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const {
    templateName,
    templateData,
    locale,
    extraKey = [],
    enabled = false,
  } = params

  const queryKey: QueryKey = [
    "preview",
    templateName,
    locale,
    ...extraKey,
  ]

  const { data, ...rest } = useQuery<
    PreviewQueryData,
    FetchError,
    PreviewQueryData,
    QueryKey
  >({
    queryKey,
    queryFn: async ({ queryKey }) => {
      return await sdk.client.fetch("/admin/notification-plugin/render-template", {
        method: "POST",
        body: {
          templateName: templateName,
          templateData: templateData,
          locale: locale,
        },
      })
    },
    staleTime: 0,
    enabled: enabled && !!templateName && !!templateData && !!locale,
    ...(options as any),
  })

  return { data, ...rest }
}
