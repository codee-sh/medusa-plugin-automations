import { Button, FocusModal, Input, Label, Select } from "@medusajs/ui"
import { useState, useMemo } from "react"
import { Pencil } from "@medusajs/icons"
import { useListAutomations } from "../../../hooks/api/automations"
import { TRIGGER_TYPES, ChannelType, TriggerType, ALL_EVENTS } from "../types"
import { useEditAutomation } from "../../../hooks/api/automations"
import { useQueryClient } from "@tanstack/react-query"

export function AutomationsTriggerFormEdit({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [triggerId, setTriggerId] = useState("")
  const [triggerType, setTriggerType] = useState<TriggerType>(TriggerType.EVENT)
  const [eventName, setEventName] = useState("")
  const [intervalMinutes, setIntervalMinutes] = useState("")
  const [active, setActive] = useState(false)
  const [channels, setChannels] = useState<ChannelType[]>([])

  const queryClient = useQueryClient()

  const { data: automationsTriggerData, isLoading: isAutomationsTriggerLoading } = useListAutomations({
    id: id,
    extraKey: [],
    enabled: open && !!id,
  })

  const { mutateAsync: editAutomation, isPending: isEditAutomationPending } = useEditAutomation()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    handleEditAutomation()
  }
  
  async function handleEditAutomation() {
    const items = {
      id: id,
      name: name,
    }
    
    const response = await editAutomation({
      id: id,
      items: [items],
    })
    queryClient.invalidateQueries({ queryKey: ["automations"] })  

    
    setOpen(false)
  }

  useMemo(() => {
    if (automationsTriggerData) {
      setName(automationsTriggerData.triggers[0].name)
      setDescription(automationsTriggerData.triggers[0].description)
      setTriggerType(automationsTriggerData.triggers[0].trigger_type)
      setEventName(automationsTriggerData.triggers[0].event_name)
      setIntervalMinutes(automationsTriggerData.triggers[0].interval_minutes)
      setActive(automationsTriggerData.triggers[0].active)
      setChannels(automationsTriggerData.triggers[0].channels)
    }
  }, [automationsTriggerData])


  return (
    <div className="flex flex-col gap-2 items-center">
      <FocusModal open={open} onOpenChange={setOpen}>
        <FocusModal.Trigger asChild>
          <Button size="small" variant="primary">
            <Pencil />
          </Button>
        </FocusModal.Trigger>
        <FocusModal.Content>
          <FocusModal.Header>
            <FocusModal.Title>Edit Automation</FocusModal.Title>
          </FocusModal.Header>
          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <FocusModal.Body>
              <div className="p-6 max-w-2xl mx-auto">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name" className="block">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter the name of the automation"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name" className="block">Description</Label>
                    <Input
                      id="name"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter the description of the automation"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name" className="block">Trigger ID</Label>
                    <Input
                      id="name"
                      value={triggerId}
                      onChange={(e) => setTriggerId(e.target.value)}
                      placeholder="Enter the trigger ID"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name" className="block">Trigger Type</Label>
                    <Select
                      value={triggerType}
                      onValueChange={(value) => setTriggerType(value as TriggerType)}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Select the trigger type" />
                      </Select.Trigger>
                      <Select.Content>
                        {TRIGGER_TYPES.map((type) => (
                          <Select.Item key={type.value} value={type.value}>
                            {type.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name" className="block">Event Name</Label>
                    <Select
                      value={eventName}
                      onValueChange={(value) => setEventName(value as string)}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Select the event name" />
                      </Select.Trigger>
                      <Select.Content>
                        {ALL_EVENTS.map((event) => (
                          <Select.Group key={event.name}>
                            <Select.Label>{event.name}</Select.Label> 
                            {event.events.map((eventItem) => (
                              <Select.Item key={eventItem.value} value={eventItem.value}>
                                {eventItem.label}
                              </Select.Item>
                            ))}
                          </Select.Group>
                        ))}
                      </Select.Content>
                    </Select>
                  </div>
                </div>
              </div>
            </FocusModal.Body>
            <FocusModal.Footer>
              <Button type="submit">Save</Button>
            </FocusModal.Footer>
          </form>
        </FocusModal.Content>
      </FocusModal>
      {value && (
        <div className="text-ui-fg-muted">
          Form submitted with name: {value}
        </div>
      )}
    </div>
  )
}