import { Checkbox, Label } from "@medusajs/ui"

interface CheckboxFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  required?: boolean
  disabled?: boolean
}

export const CheckboxField = ({
  label,
  checked,
  onChange,
  required = false,
  disabled = false,
}: CheckboxFieldProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        id={`checkbox-${label}`}
      />
      <Label
        htmlFor={`checkbox-${label}`}
        className="text-sm font-medium cursor-pointer"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </Label>
    </div>
  )
}
