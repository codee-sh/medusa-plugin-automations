import { Button, FocusModal, Input, Label, Select, Checkbox } from "@medusajs/ui"
import { useState, useMemo } from "react"
import { Plus } from "@medusajs/icons"
import { TRIGGER_TYPES, ChannelType, TriggerType, ALL_EVENTS, CHANNEL_TYPES } from "../types"
import { useCreateAutomation } from "../../../hooks/api/automations"
import { useQueryClient } from "@tanstack/react-query"

export function AutomationsFormCreate() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [triggerId, setTriggerId] = useState("")
  const [triggerType, setTriggerType] = useState<TriggerType>(TriggerType.EVENT)
  const [eventName, setEventName] = useState("")
  const [intervalMinutes, setIntervalMinutes] = useState("")
  const [active, setActive] = useState(false)
  const [channels, setChannels] = useState<Record<string, boolean> | null>(null)

  const queryClient = useQueryClient()

  const { mutateAsync: createAutomation, isPending: isCreateAutomationPending } = useCreateAutomation()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    handleCreateAutomation()
  }
  
  async function handleCreateAutomation() {
    const items = {
      name: name,
      description: description,
      trigger_type: triggerType,
      event_name: eventName,
      interval_minutes: intervalMinutes,
      active: active,
      channels: channels,
    }
    
    await createAutomation({
      id: id,
      items: [items],
    })

    queryClient.invalidateQueries({ queryKey: ["automations"] })  

    setOpen(false)
  }

  // useMemo(() => {
  //   if (automationsTriggerData) {
  //     const trigger = automationsTriggerData.triggers[0]
  //     setName(trigger.name)
  //     setDescription(trigger.description)
  //     setTriggerType(trigger.trigger_type)
  //     setEventName(trigger.event_name)
  //     setIntervalMinutes(trigger.interval_minutes)
  //     setActive(trigger.active)
  //     setChannels(trigger.channels as Record<string, boolean> | null)
  //   }
  // }, [automationsTriggerData])

  return (
    <div className="flex flex-col gap-2 items-center">
      <FocusModal open={open} onOpenChange={setOpen}>
        <FocusModal.Trigger asChild>
          <Button size="small" variant="primary">
            <Plus />
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
                    <Label htmlFor="channels" className="block">Channels</Label>
                    <div className="flex flex-col gap-2">
                      {CHANNEL_TYPES.map((channel) => (
                        <div key={channel.value} className="flex items-center space-x-2">
                          <Checkbox
                            checked={channels?.[channel.value] === true}
                            onCheckedChange={(checked) => {
                              setChannels({
                                ...(channels || {}),
                                [channel.value]: checked === true
                              })
                            }}
                            id={`channel-${channel.value}`}
                          />
                          <Label
                            htmlFor={`channel-${channel.value}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {channel.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="active" className="block">Active</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={active}
                        onCheckedChange={(checked) => setActive(checked === true)}
                        id="active"
                      />
                      <Label
                        htmlFor="active"
                        className="text-sm font-medium cursor-pointer"
                      >
                        {active ? 'Yes' : 'No'}
                      </Label>
                    </div>
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
              <Button type="submit" disabled={isCreateAutomationPending} isLoading={isCreateAutomationPending}>Save</Button>
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