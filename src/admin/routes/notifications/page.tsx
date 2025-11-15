import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight } from "@medusajs/icons"

const NotificationsPage = () => {
  return (
    <div>
      <h1>Notifications</h1>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Notifications",
  icon: ChatBubbleLeftRight,
})

export default NotificationsPage
