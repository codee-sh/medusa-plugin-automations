import { Select, Label } from "@medusajs/ui"

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<any>
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
  const isGrouped = options.length > 0 && options[0]?.groupName && options[0]?.options

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
        {isGrouped ? (
          options.map((option) => (
            <Select.Group key={option?.groupName}>
              <Select.Label>{option?.groupName}</Select.Label>
              {option.options.map((option: { value: string; name: string }) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.name}
                </Select.Item>
              ))}
            </Select.Group>
          ))
        ) : (
          options.map((option: { value: string; name: string }) => (
            <Select.Item key={option.value} value={option.value}>
              {option.name}
            </Select.Item>
          ))
        )}
      </Select.Content>
    </Select>
  )
}
