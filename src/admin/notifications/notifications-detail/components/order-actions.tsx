import { Button, Label, Select, Text } from "@medusajs/ui"
import { useState } from "react"

interface OrderActionsProps {
  onSend: (eventName: string) => void
  isPending: boolean
}

const actionOptions = [
  { value: "order.placed", label: "Order Placed" },
  { value: "order.completed", label: "Order Completed" }
]

export const Actions = ({ onSend, isPending, isError, eventsData }: { onSend: (any: any) => any, isPending: boolean, isError: boolean, eventsData: any }) => {
  const handleSend = (eventName: string) => {
    onSend({ name: eventName, trigger_type: "admin" })
  }

  return (
    <div className="px-6 py-0">
      <SelectAction onSend={handleSend} isPending={isPending} />

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

export const SelectAction = ({ onSend, isPending }: OrderActionsProps) => {
  const [selectedEvent, setSelectedEvent] = useState<string>("order.placed")

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-row items-center gap-2">
        <Label className="flex-shrink-0">Select event:</Label>
        <div className="flex-1">
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <Select.Trigger>
              <Select.Value placeholder="Select event name" />
            </Select.Trigger>
            <Select.Content>
              {actionOptions.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => onSend(selectedEvent)}
          disabled={isPending || !selectedEvent}
        >
          {isPending
            ? "Sending..."
            : `Send Notification`}
        </Button>
      </div>
    </div>
  )
}

