import { Label, Select, Button, Text, Hint } from "@medusajs/ui"
import { Controller, useWatch, Control } from "react-hook-form"
import { Trash } from "@medusajs/icons"
import { OPERATOR_TYPES } from "../../../../modules/mpn-automation/types/types"
import { RuleValueInput } from "./rule-value-input"
import { Attribute } from "../../../../modules/mpn-automation/types/types"

interface RuleItemProps {
  control: Control<any>
  index: number
  eventAttributes: Attribute[]
  onRemove: () => void
}

export function RuleItem({
  control,
  index,
  eventAttributes,
  onRemove,
}: RuleItemProps) {
  const selectedAttributeValue = useWatch({
    control,
    name: `rules.items.${index}.attribute`,
  })

  const operatorValue = useWatch({
    control,
    name: `rules.items.${index}.operator`,
  })

  // Find the selected attribute metadata
  const selectedAttribute = selectedAttributeValue && eventAttributes.length
    ? (eventAttributes.find(
        (attr: Attribute) => attr.value === selectedAttributeValue
      ) as Attribute | undefined)
    : null

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <Controller
            name={`rules.items.${index}.attribute`}
            control={control}
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
                      <Select.Item
                        key={
                          attribute.value ||
                          `attr-${index}-${attrIndex}`
                        }
                        value={attribute.value || ""}
                      >
                        {attribute.label}{" "}
                        <span className="text-xs text-gray-500">
                          ({attribute.value})
                        </span>
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
                {fieldState.error && (
                  <span className="text-red-500 text-sm">
                    {fieldState.error.message}
                  </span>
                )}
                {selectedAttribute?.description && (
                  <Hint className="mt-1">
                    {selectedAttribute.description}
                  </Hint>
                )}
              </>
            )}
          />
          <Controller
            name={`rules.items.${index}.operator`}
            control={control}
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
                      <Select.Item
                        key={operator.value || `op-${opIndex}`}
                        value={operator.value}
                      >
                        {operator.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
                {fieldState.error && (
                  <span className="text-red-500 text-sm">
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
          <RuleValueInput
            control={control}
            name={`rules.items.${index}.rule_values.0.value`}
            operator={operatorValue}
          />
          {selectedAttribute?.examples &&
            selectedAttribute.examples.length > 0 && (
              <div className="mt-0">
                <Text size="xsmall" className="text-gray-600 mb-1">
                  Examples:
                </Text>
                <div className="flex flex-wrap gap-1">
                  {selectedAttribute.examples.map(
                    (example, exampleIndex) => (
                      <span
                        key={`example-${index}-${exampleIndex}`}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-700"
                      >
                        {example}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={onRemove}
          className="mt-2"
        >
          <Trash />
        </Button>
      </div>
    </div>
  )
}

