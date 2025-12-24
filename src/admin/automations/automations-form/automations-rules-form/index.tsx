import { Button } from "@medusajs/ui"
import { useAvailableEvents } from "../../../../hooks/api/available-events"
import { useFieldArray } from "react-hook-form"
import { useMemo } from "react"
import { Plus } from "@medusajs/icons"
import { RuleItem } from "./rule-item"

export function AutomationsRulesForm({
  form,
  isOpen,
}: {
  form: any
  isOpen?: boolean
}) {
  const {
    data: availableEventsData,
    isLoading: isAvailableEventsLoading,
  } = useAvailableEvents({
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

  const {
    fields = [],
    append,
    remove,
  } = useFieldArray({
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
              No rules added yet. Click "Add Item" to create
              a new rule.
            </div>
          )}
          {fields.map((field, index) => (
            <RuleItem
              key={field?.id ?? `rule-${index}`}
              control={form.control}
              index={index}
              eventAttributes={eventAttributes}
              onRemove={() => handleRemoveRule(index)}
            />
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddRule}
            className="w-full"
          >
            <Plus />
            Add condition
          </Button>
        </div>
      </div>
    </div>
  )
}
