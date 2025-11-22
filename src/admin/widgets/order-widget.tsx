import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button } from "@medusajs/ui"
import { useEvents } from "../../hooks/api/events"

interface WidgetData {
  id: string
}

const OrderWidget = ({ data }: { data: WidgetData }) => {
  const entityType = 'order'
  const entityId = data.id

  const { mutate: sendEvent, isPending, isError, data: eventsData } = useEvents()

  const handleSendNotification = () => {
    sendEvent({
      name: "order.placed",
      data: {
        id: entityId,
        trigger_type: "preview",
      },
    })
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-col gap-2 px-6 py-4">
        <Heading>Notifications</Heading>
      </div>
      <div className="px-6 py-4">
        <Button onClick={handleSendNotification} disabled={isPending}>
          {isPending ? "Sending..." : "Send Order Placed Notification for this order"}
        </Button>
        {eventsData && (
          <Text className="mt-2 text-green-600">
            {eventsData.message}
          </Text>
        )}
        {isError && (
          <Text className="mt-2 text-red-600">
            Error sending notification
          </Text>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.after",
})

export default OrderWidget
