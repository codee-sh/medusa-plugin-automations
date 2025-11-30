import { Input, Label, Select } from "@medusajs/ui"
import { useAvailableEvents } from "../../../../hooks/api/available-events"
import { OPERATOR_TYPES } from "../../../../modules/mpn-automation/types"
import { Controller } from "react-hook-form"
import { useMemo } from "react"
  
export function AutomationsRulesForm({ form, isOpen }: { form: any; isOpen?: boolean }) {
  const { data: availableEventsData, isLoading: isAvailableEventsLoading } = useAvailableEvents({
    enabled: isOpen !== false,
  })

  const eventName = form.watch("general.event_name")

  const eventAttributes = useMemo(() => {
    if (!availableEventsData?.events || !eventName) {
      return []
    }

    for (const eventGroup of availableEventsData.events) {
      const foundEvent = eventGroup.events?.find(
        (event: any) => event.value === eventName
      ) as any

      if (foundEvent && foundEvent.attributes) {
        return foundEvent.attributes
      }
    }

    return []
  }, [availableEventsData, eventName])

  const rules = form.watch("rules.items")

  return (
    <div className="w-full">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex flex-col gap-4">
          {rules?.map((rule: any, index: number) => (
            <div key={rule.id || index}>
            <Controller
              name={`rules.items.${index}.attribute`}
              control={form.control}
              render={({ field, fieldState }) => (
                <>     
                  <Select 
                    key={`attribute-${index}-${eventAttributes.length}-${field.value}`}
                    value={field.value ?? ""} 
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
                  >
                    <Select.Trigger>
                      <Select.Value placeholder="Select the attribute" />
                    </Select.Trigger>
                    <Select.Content>
                      {eventAttributes.map((attribute) => (
                        <Select.Item key={attribute.value} value={attribute.value}>
                          {attribute.label}
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
              <Controller
                name={`rules.items.${index}.operator`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                  <Select
                    key={`operator-${index}-${eventAttributes.length}-${field.value}`}
                    value={field.value ?? ""}
                    onValueChange={(value) => {
                      field.onChange(value as string)
                    }}
                  >
                    <Select.Trigger>
                      <Select.Value placeholder="Select the operator" />
                    </Select.Trigger>
                    <Select.Content>
                      {OPERATOR_TYPES.map((operator) => (
                        <Select.Item key={operator.value} value={operator.value}>
                          {operator.label}
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
              <Controller
                name={`rules.items.${index}.rule_values.0.value`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      key={`rule-value-${index}-${eventAttributes.length}-${field.value}`}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        field.onChange(e.target.value)
                      }}
                    />
                    {fieldState.error && (
                      <span className="text-red-500 text-sm">{fieldState.error.message}</span>
                    )}
                  </>
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}