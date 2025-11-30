import { Input, Label, Select, Button } from "@medusajs/ui"
import { useAvailableEvents } from "../../../../hooks/api/available-events"
import { OPERATOR_TYPES } from "../../../../modules/mpn-automation/types"
import { Controller, useFieldArray } from "react-hook-form"
import { useMemo } from "react"
import { Trash, Plus } from "@medusajs/icons"
  
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

  const { fields = [], append, remove } = useFieldArray({
    control: form.control,
    name: "rules.items",
  })

  const handleAddRule = () => {
    append({
      attribute: "",
      operator: "",
      rule_values: [
        {
          value: "",
        },
      ],
    })
  }

  const handleRemoveRule = (index: number) => {
    remove(index)
  }

  return (
    <div className="w-full">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex flex-col gap-4">
          {fields.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
              No rules added yet. Click "Add Item" to create a new rule.
            </div>
          )}
          {fields.map((field, index) => (
            <div key={field?.id ?? `rule-${index}`} className="flex flex-col gap-2 p-4 border rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 flex flex-col gap-2">
                    <Controller
                      name={`rules.items.${index}.attribute`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <>
                          <Label>Attribute</Label>
                          <Select 
                            key={`attribute-${index}-${eventAttributes.length}`}
                            value={field.value ?? ""}
                            onValueChange={(value) => {
                              field.onChange(value)
                            }}
                          >
                            <Select.Trigger>
                              <Select.Value placeholder="Select the attribute" />
                            </Select.Trigger>
                            <Select.Content>
                              {eventAttributes.map((attribute, attrIndex) => (
                                <Select.Item key={attribute.value || `attr-${index}-${attrIndex}`} value={attribute.value || "ss"}>
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
                        <Label>Operator</Label>
                        <Select
                          key={`operator-${index}-${eventAttributes.length}-${field.value ?? ""}`}
                          value={field.value ?? ""}
                          onValueChange={(value) => {
                            field.onChange(value as string)
                          }}
                        >
                          <Select.Trigger>
                            <Select.Value placeholder="Select the operator" />
                          </Select.Trigger>
                          <Select.Content>
                            {OPERATOR_TYPES.map((operator, opIndex) => (
                              <Select.Item key={operator.value || `op-${opIndex}`} value={operator.value}>
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
                          <Label>Value</Label>
                          <Input
                            value={field.value ?? ""}
                            onChange={(e) => {
                              field.onChange(e.target.value)
                            }}
                            onBlur={field.onBlur}
                            ref={field.ref}
                          />
                          {fieldState.error && (
                            <span className="text-red-500 text-sm">{fieldState.error.message}</span>
                          )}
                        </>
                      )}
                    />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={() => handleRemoveRule(index)}
                  className="mt-2"
                >
                  <Trash />
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddRule}
            className="w-full"
          >
            <Plus />
            Add Item
          </Button>
        </div>
      </div>
    </div>
  )
}