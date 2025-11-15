import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"

interface WidgetData {
  id: string
}

const OrderWidget = ({ data }: { data: WidgetData }) => {
  // const entityType = 'order'
  // const entityId = data.id

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-col gap-2 px-6 py-4">
        <Heading>Notificss</Heading>
        <Text size="small">
          Send notifications to the admin dashboard when a certain action occurs using a subscriber, a custom workflow or a workflow hook.
        </Text>
      </div>
      <div className="px-6 py-4">
        
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.after",
})

export default OrderWidget
