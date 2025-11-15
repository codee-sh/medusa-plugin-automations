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


export type UseOrdersParams = {
  limit?: number;
  offset?: number;
  extraKey?: unknown[];
  enabled?: boolean;
  fields?: string;
};

type OrdersQueryData = {
  orders: any;
  count: number;
};

export const useOrders = (
  params: UseOrdersParams = {},
  options?: Omit<
    UseQueryOptions<OrdersQueryData, FetchError, OrdersQueryData, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { limit = 100, offset = 0, extraKey = [], enabled, fields = "id,display_id" } = params;

  const queryKey: QueryKey = [
    "orders", 
    ...extraKey
  ];
  
  const query = {
    limit,
    offset,
    fields,
  } as any;

  const { data, ...rest } = useQuery<
    OrdersQueryData,
    FetchError,
    OrdersQueryData,
    QueryKey
  >({
    queryKey,
    queryFn: async () => {
      return await sdk.admin.order.list(query)
    },
    enabled,
    ...(options as any),
  });

  return { data, ...rest };
};


export type UseOrderParams = {
  order_id: string
  extraKey?: unknown[]
  enabled?: boolean
}

type OrderQueryData = HttpTypes.AdminOrder

export const useOrder = (
  params: UseOrderParams,
  options?: Omit<
    UseQueryOptions<
      OrderQueryData,
      FetchError,
      OrderQueryData,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const {
    order_id,
    extraKey = [],
    enabled = false,
  } = params

  const queryKey: QueryKey = [
    "order",
    order_id,
    ...extraKey,
  ]

  const { data, ...rest } = useQuery<
    OrderQueryData,
    FetchError,
    OrderQueryData,
    QueryKey
  >({
    queryKey,
    queryFn: async () => {
      const { order } = await sdk.admin.order.retrieve(order_id, {
        fields: "id,status,created_at,canceled_at,email,display_id,currency_code,metadata,total,credit_line_total,item_total,shipping_subtotal,original_total,subtotal,discount_total,discount_subtotal,shipping_total,shipping_tax_total,tax_total,refundable_total,order_change,*customer,*items,*items.variant,*items.variant.product,*items.variant.options,+items.variant.manage_inventory,*items.variant.inventory_items.inventory,+items.variant.inventory_items.required_quantity,+summary,*shipping_address,*billing_address,*sales_channel,*promotions,*shipping_methods,*credit_lines,*fulfillments,+fulfillments.shipping_option.service_zone.fulfillment_set.type,*fulfillments.items,*fulfillments.labels,*fulfillments.labels,*payment_collections,*payment_collections.payments,*payment_collections.payments.refunds,*payment_collections.payments.refunds.refund_reason,region.automatic_taxes",
      })

      return order
    },
    staleTime: 0,
    enabled: enabled,
    ...(options as any),
  })

  return { data, ...rest }
}
