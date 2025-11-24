import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { NotificationOrder } from "./notification-order"
import { NotificationOrderPayment } from "./notification-order-payment"

export const NotificationsDetail = ({ type, data }: { type: string, data: any }) => {
  return (
    <Container className="p-0">
      <Header />
      <div className="py-4">
        {type === "order" && (
          <>
            <div className="flex flex-col gap-y-3">
              <NotificationOrder data={data} />
              <NotificationOrderPayment data={data} />
            </div>
          </>
        )}
      </div>
    </Container>
  )
}

const Header = () => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b">
      <Heading level="h2">Notifications - Actions</Heading>
    </div>
  )
}
