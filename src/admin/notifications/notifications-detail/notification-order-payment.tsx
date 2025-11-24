import { useEvents } from "../../../hooks/api/events"
import { Actions as OrderPaymentActions } from "./components/order-payment-actions"

export const NotificationOrderPayment = ({ data }: { data: any }) => {
  const { mutate: sendEvent, isPending, isError, data: eventsData } = useEvents()

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
    <OrderPaymentActions onSend={handleSendPaymentNotification} isPending={isPending} isError={isError} eventsData={eventsData} />
  )
}