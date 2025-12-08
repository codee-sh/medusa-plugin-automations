import { Input, Label } from "@medusajs/ui"

interface FormFieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
}

export const FormField = ({
  label,
  required,
  children,
}: FormFieldProps) => {
  return (
    <div>
      <div className="mb-2">
        <Label className="text-sm font-medium">
          {label}
          {required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </Label>
      </div>
      {children}
    </div>
  )
}
