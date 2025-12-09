import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {

  console.log("orderPlacedHandler", JSON.stringify(data, null, 2))
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
