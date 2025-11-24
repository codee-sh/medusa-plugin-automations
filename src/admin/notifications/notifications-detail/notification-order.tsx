import { useEvents } from "../../../hooks/api/events"
import { Actions as OrderActions } from "./components/order-actions"

export const NotificationOrder = ({ data }: { data: any }) => {
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

  return (
    <OrderActions onSend={handleSendOrderNotification} isPending={isPending} isError={isError} eventsData={eventsData} />
  )
}