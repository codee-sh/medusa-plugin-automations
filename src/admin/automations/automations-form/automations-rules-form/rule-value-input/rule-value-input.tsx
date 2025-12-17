import { Input, Label } from "@medusajs/ui"
import { Controller, Control } from "react-hook-form"
import { OperatorType } from "../../../../../modules/mpn-automation/types/types"
import { ChipInput } from "../../../../components/inputs/chip-input"

type RuleValueInputProps = {
  control: Control<any>
  name: string
  operator: string
}

export function RuleValueInput({
  control,
  name,
  operator,
}: RuleValueInputProps) {
  const arrayOperators = [
    OperatorType.IN,
    OperatorType.NOT_IN,
    OperatorType.CONTAINS,
    OperatorType.NOT_CONTAINS,
  ]

  const noValueOperators = [
    OperatorType.EMPTY,
    OperatorType.NOT_EMPTY,
  ]

  const isArrayOperator = arrayOperators.includes(operator as OperatorType)
  const isNoValueOperator = noValueOperators.includes(operator as OperatorType)

  if (isNoValueOperator) {
    return null
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        if (isArrayOperator) {
          const arrayValue = Array.isArray(field.value)
            ? field.value
            : field.value
              ? [String(field.value)]
              : []

          return (
            <>
              <Label>Values</Label>
              <ChipInput
                value={arrayValue}
                onChange={(values) => field.onChange(values)}
                onBlur={field.onBlur}
                placeholder="Add values (press Enter or comma)"
                allowDuplicates={false}
              />
              {fieldState.error && (
                <span className="text-red-500 text-sm">
                  {fieldState.error.message}
                </span>
              )}
            </>
          )
        }

        const stringValue = Array.isArray(field.value)
          ? field.value[0] || ""
          : field.value ?? ""

        return (
          <>
            <Label>Value</Label>
            <Input
              value={stringValue}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              ref={field.ref}
              placeholder="Enter value"
            />
            {fieldState.error && (
              <span className="text-red-500 text-sm">
                {fieldState.error.message}
              </span>
            )}
          </>
        )
      }}
    />
  )
}

