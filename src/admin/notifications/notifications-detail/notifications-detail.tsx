import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useEvents } from "../../../hooks/api/events"
import { Actions as OrderActions } from "./components/order-actions"
import { Actions as OrderPaymentActions } from "./components/order-payment-actions"

export const NotificationsDetail = ({ type, data }: { type: string, data: any }) => {
  const { mutate: sendEvent, isPending, isError, data: eventsData } = useEvents()

  const handleSendOrderNotification = ({ name, trigger_type }: { name: string, trigger_type: string }) => {
    sendEvent({
      name: name,
      data: {
        id: data.id,
        trigger_type: trigger_type,
      },
    })
  }

  const handleSendPaymentNotification = ({ name, trigger_type }: { name: string, trigger_type: string }) => {
    sendEvent({
      name: name,
      data: {
        id: data?.payment_collections[0]?.payments[0]?.id,
        trigger_type: trigger_type,
      },
    })
  }

  return (
    <Container className="p-0">
      <Header />
      {type === "order" && (
        <>
          <OrderActions onSend={handleSendOrderNotification} isPending={isPending} isError={isError} eventsData={eventsData} />
          <OrderPaymentActions onSend={handleSendPaymentNotification} isPending={isPending} isError={isError} eventsData={eventsData} />
        </>
      )}
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
