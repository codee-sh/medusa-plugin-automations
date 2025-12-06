import { Label, Select, Button } from "@medusajs/ui"
import { useAvailableActions } from "../../../../hooks/api/available-actions"
import { Controller, useFieldArray, useWatch } from "react-hook-form"
import { Trash, Plus } from "@medusajs/icons"
import LoadActionComponent from "../../../components/actions/utils/dynamic-component"

export function AutomationsActionsForm({
  form,
  isOpen,
}: {
  form: any
  isOpen?: boolean
}) {
  const { data: availableActionsData, isLoading: isAvailableActionsLoading } =
    useAvailableActions({
      enabled: isOpen !== false,
    })

  const { fields = [], append, remove } = useFieldArray({
    control: form.control,
    name: "actions.items",
  })

  // Watch actual values from form (not just metadata from fields)
  const watchedActions = useWatch({
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
          {JSON.stringify(watchedActions)}
          {fields.map((field, index) => {
            return (
              <Controller
                key={field?.id ?? `action-${index}`}
                name={`actions.items.${index}.action_type`}
                control={form.control}
                render={({ field: actionTypeField, fieldState }) => {
                  const actionType = actionTypeField.value
                  // Find the action config component path
                  const actionData: any = availableActionsData?.actions?.find(
                    (a) => a.value === actionType
                  )
                  const configComponentPath = actionData?.configComponentPath

                  return (
                    <div className="flex flex-col gap-4 p-4 border rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 flex flex-col gap-2">
                          <Label>Action Type</Label>
                          <Select
                            key={`action-type-${index}-${availableActionsData?.actions?.length || 0}`}
                            value={actionTypeField.value ?? ""}
                            onValueChange={(value) => {
                              actionTypeField.onChange(value)
                              // Reset config when action type changes
                              form.setValue(
                                `actions.items.${index}.config`,
                                {},
                                { shouldValidate: false, shouldDirty: true }
                              )
                            }}
                          >
                            <Select.Trigger>
                              <Select.Value placeholder="Select the action type" />
                            </Select.Trigger>
                            <Select.Content>
                              {availableActionsData?.actions?.map(
                                (action, actionIndex) => (
                                  <Select.Item
                                    key={
                                      action.value ||
                                      `action-${index}-${actionIndex}`
                                    }
                                    value={action.value || ""}
                                  >
                                    {action.label}
                                  </Select.Item>
                                )
                              )}
                            </Select.Content>
                          </Select>
                          {fieldState.error && (
                            <span className="text-red-500 text-sm">
                              {fieldState.error.message}
                            </span>
                          )}
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

                      {/* Dynamic configuration component */}
                      {actionType && configComponentPath && (
                        <div className="mt-4 pt-4 border-t">
                          <LoadActionComponent
                            actionType={actionType}
                            configComponentPath={configComponentPath}
                            control={form.control}
                            name={`actions.items.${index}.config` as any}
                            errors={
                              form.formState.errors?.actions?.items?.[index]
                                ?.config as Record<string, string> | undefined
                            }
                          />
                        </div>
                      )}
                    </div>
                  )
                }}
              />
            )
          })}
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