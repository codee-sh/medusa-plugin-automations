import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useEvents } from "../../../hooks/api/events"
import { Actions as OrderActions } from "./components/order-actions"

export const NotificationsDetail = ({ entityId, entityType }: { entityId: string, entityType: string }) => {
  const { mutate: sendEvent, isPending, isError, data: eventsData } = useEvents()

  const handleSendNotification = ({ name, trigger_type }: { name: string, trigger_type: string }) => {
    sendEvent({
      name: name,
      data: {
        id: entityId,
        trigger_type: trigger_type,
      },
    })
  }

  return (
    <Container className="p-0">
      <Header />
      {entityType === "order" && (
        <OrderActions onSend={handleSendNotification} isPending={isPending} isError={isError} eventsData={eventsData} />
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
