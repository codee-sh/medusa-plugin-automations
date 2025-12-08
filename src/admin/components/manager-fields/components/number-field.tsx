import { Input, Label } from "@medusajs/ui"

interface NumberFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  min?: number | null
  max?: number | null
  step?: number | null
}

export const NumberField = ({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  min,
  max,
  step = null,
}: NumberFieldProps) => {
  return (
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      placeholder={placeholder}
      disabled={disabled}
      min={min || undefined}
      max={max || undefined}
      step={step || undefined}
    />
  )
}
