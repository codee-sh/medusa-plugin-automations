import { Textarea, Label } from "@medusajs/ui"

interface TextAreaFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  rows?: number
}

export const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  rows = 3,
}: TextAreaFieldProps) => {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
    />
  )
}
