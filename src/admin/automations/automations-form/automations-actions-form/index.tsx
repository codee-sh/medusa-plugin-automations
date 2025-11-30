import { Label, Select, Button } from "@medusajs/ui"
import { useAvailableActions } from "../../../../hooks/api/available-actions"
import { Controller, useFieldArray } from "react-hook-form"
import { Trash, Plus } from "@medusajs/icons"
  
export function AutomationsActionsForm({ form, isOpen }: { form: any; isOpen?: boolean }) {
  const { data: availableActionsData, isLoading: isAvailableActionsLoading } = useAvailableActions({
    enabled: isOpen !== false,
  })

  const { fields = [], append, remove } = useFieldArray({
    control: form.control,
    name: "actions.items",
  })

  const handleAddAction = () => {
    append({
      action_type: "",
      config: {},
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
              No actions added yet. Click "Add Item" to create a new action.
            </div>
          )}
          {fields.map((field, index) => (
            <div key={field?.id ?? `rule-${index}`} className="flex flex-col gap-2 p-4 border rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 flex flex-col gap-2">
                    <Controller
                      name={`actions.items.${index}.action_type`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <>
                          <Label>Action Type</Label>
                          <Select 
                            key={`action-type-${index}-${availableActionsData.actions.length}`}
                            value={field.value ?? ""}
                            onValueChange={(value) => {
                              field.onChange(value)
                            }}
                          >
                            <Select.Trigger>
                              <Select.Value placeholder="Select the action type" />
                            </Select.Trigger>
                            <Select.Content>
                              {availableActionsData.actions.map((action, actionIndex) => (
                                <Select.Item key={action.value || `action-${index}-${actionIndex}`} value={action.value || "ss"}>
                                  {action.label}
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
            onClick={handleAddAction}
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