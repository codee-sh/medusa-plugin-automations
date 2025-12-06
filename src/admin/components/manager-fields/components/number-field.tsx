import { Input, Label } from "@medusajs/ui"

interface NumberFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  min?: number
  max?: number
  step?: number
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
  step = 1
}: NumberFieldProps) => {
  return (
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
    />
  )
} 
