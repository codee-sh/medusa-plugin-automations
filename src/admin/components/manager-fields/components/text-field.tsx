import { Input, Label } from "@medusajs/ui"

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
}

export const TextField = ({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
}: TextFieldProps) => {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
  )
}
