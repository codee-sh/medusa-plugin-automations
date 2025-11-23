import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEvents } from "../../hooks/api/events"
import { NotificationsDetail } from "../notifications/notifications-detail/notifications-detail"
import { NotificationsList } from "../notifications/notifications-list/notifications-list"

interface WidgetData {
  id: string
}

const OrderNotificationActivityWidget = ({ data }: { data: WidgetData }) => {
  const entityType = 'order'
  const entityId = data.id

  return (
    <div className="flex w-full flex-col gap-y-3">
      <NotificationsDetail entityId={entityId} entityType={entityType} />
      <NotificationsList entityId={entityId} entityType={entityType} />
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.after",
})

export default OrderNotificationActivityWidget
