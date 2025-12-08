import { Select, Label } from "@medusajs/ui"

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  required?: boolean
  disabled?: boolean
}

export const SelectField = ({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
}: SelectFieldProps) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <Select.Trigger>
        <Select.Value placeholder="Select an option" />
      </Select.Trigger>
      <Select.Content>
        {options.map((option) => (
          <Select.Item
            key={option.value}
            value={option.value}
          >
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  )
}
