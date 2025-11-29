import { Input, Label, Select, Checkbox } from "@medusajs/ui"
import { TRIGGER_TYPES, ALL_EVENTS, CHANNEL_TYPES } from "../../types"
import { Controller } from "react-hook-form"
  
export function AutomationsEditGeneralForm({ form }: { form: any }) {
  return (
    <div className="w-full">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="block">Name</Label>
            <Controller
              name="general.name"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input {...field} placeholder="Enter the name of the automation" />
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">{fieldState.error.message}</span>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className="block">Description</Label>
            <Controller
              name="general.description"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input {...field} placeholder="Enter the description of the automation" />
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">{fieldState.error.message}</span>
                  )}
                </>
              )}
            />   
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="trigger_type" className="block">Trigger Type</Label>
            <Controller
              name="general.trigger_type"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Select 
                    value={field.value || ""} 
                    onValueChange={(value) => field.onChange(value || undefined)}
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
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">{fieldState.error.message}</span>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="channels" className="block">Channels</Label>
            <Controller
              name="general.channels"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  {CHANNEL_TYPES.map((channel) => (
                    <div key={channel.value} className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value?.[channel.value] === true}
                        onCheckedChange={(checked) => {
                          field.onChange({
                            ...(field.value || {}),
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
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="active" className="block">Active</Label>
            <div className="flex items-center space-x-2">
              <Controller
                name="general.active"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox 
                      checked={field.value || false} 
                      onCheckedChange={(checked) => field.onChange(checked === true)} 
                      id="active" 
                    />
                    <Label
                      htmlFor="active"
                      className="text-sm font-medium cursor-pointer"
                    >
                      {field.value ? 'Yes' : 'No'}
                    </Label>
                    {fieldState.error && (
                      <span className="text-red-500 text-sm">{fieldState.error.message}</span>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="event_name" className="block">Event Name</Label>
            <Controller
              name="general.event_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Select 
                    value={field.value || ""} 
                    onValueChange={(value) => field.onChange(value || undefined)}
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
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">{fieldState.error.message}</span>
                  )}
                </>
              )}
            />   
          </div>
        </div>
      </div>
    </div>
  )
}

