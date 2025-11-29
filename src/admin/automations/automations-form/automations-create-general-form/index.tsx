import { Input, Label, Select, Checkbox } from "@medusajs/ui"
import { useState } from "react"
import { TRIGGER_TYPES, ChannelType, TriggerType, ALL_EVENTS, CHANNEL_TYPES } from "../../types"
import { useCreateAutomation } from "../../../../hooks/api/automations"
import { useQueryClient } from "@tanstack/react-query"
import { Controller } from "react-hook-form"
  
export function AutomationsCreateGeneralForm({ form }: { form: any }) {
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
    // const items = {
    //   name: name,
    //   description: description,
    //   trigger_type: triggerType,
    //   event_name: eventName,
    //   interval_minutes: intervalMinutes,
    //   active: active,
    //   channels: channels,
    // }
    
    // await createAutomation({
    //   id: id,
    //   items: [items],
    // })

    // queryClient.invalidateQueries({ queryKey: ["automations"] })
  }

  return (
    <div className="w-full">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="block">Name</Label>
            <Controller
              name="general.name"
              control={form.control}
              render={({ field, fieldState }) => <>
                <Input {...field} placeholder="Enter the name of the automation" />
                {fieldState.error && (
                  <span className="text-red-500">{fieldState.error.message}</span>
                )}
              </>}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="block">Description</Label>
            <Controller
              name="general.description"
              control={form.control}
              render={({ field, fieldState }) => <>
                <Input {...field} placeholder="Enter the description of the automation" />
                {fieldState.error && (
                  <span className="text-red-500">{fieldState.error.message}</span>
                )}
              </>}
            />   
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="block">Trigger Type</Label>
            <Controller
              name="general.trigger_type"
              control={form.control}
              render={({ field, fieldState }) => <>
              <Select value={field.value || ""} onValueChange={(value) => { field.onChange(value || undefined) }}>
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
              {fieldState.error && (
                <span className="text-red-500">{fieldState.error.message}</span>
              )}
              </>}
            />
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
              <Controller
                name="general.active"
                control={form.control}
                render={({ field, fieldState }) => <>
                  <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} id="active" />
                  <Label
                    htmlFor="active"
                    className="text-sm font-medium cursor-pointer"
                  >
                    {field.value ? 'Yes' : 'No'}
                  </Label>
                  {fieldState.error && (
                    <span className="text-red-500">{fieldState.error.message} ss</span>
                  )}
                </>}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="block">Event Name</Label>

            <Controller
              name="general.event_name"
              control={form.control}
              render={({ field, fieldState }) => <>
                <Select value={field.value || ""} onValueChange={(value) => { field.onChange(value || undefined) }}>
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
                {fieldState.error && (
                  <span className="text-red-500">{fieldState.error.message}</span>
                )}
              </>}
            />   
          </div>
        </div>
      </div>
    </div>
  )
}