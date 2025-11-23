import { Container, Heading, Button, Text, Select } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useEvents } from "../../../hooks/api/events"

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
      <Actions handleSendNotification={handleSendNotification} isPending={isPending} isError={isError} eventsData={eventsData} />
    </Container>
  )
}

const Actions = ({ handleSendNotification, isPending, isError, eventsData }: { handleSendNotification: (any: any) => any, isPending: boolean, isError: boolean, eventsData: any }) => {
  const [selectedEvent, setSelectedEvent] = useState<string>("order.placed")

  const eventOptions = [
    { value: "order.placed", label: "Order Placed" },
    { value: "order.completed", label: "Order Completed" },
  ]

  return (
    <div className="px-6 py-4">
      <div className="flex flex-col gap-2">
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <Select.Trigger>
            <Select.Value placeholder="Select event name" />
          </Select.Trigger>
          <Select.Content>
            {eventOptions.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        <Button onClick={() => handleSendNotification({ name: selectedEvent, trigger_type: "admin" })} disabled={isPending || !selectedEvent}>
          {isPending ? "Sending..." : `Send ${eventOptions.find(opt => opt.value === selectedEvent)?.label || selectedEvent} Notification`}
        </Button>
      </div>
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
