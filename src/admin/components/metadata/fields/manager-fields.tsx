import { useState, useEffect } from "react"
import { Button } from "@medusajs/ui"
import { TextField, TextAreaField, NumberField, SelectField, CheckboxField } from "./components"
import { ChipInput } from "../../../components/inputs/chip-input" 
import { FieldConfig } from "./types"
import { FormField } from "./components/form-field"
import { Input } from "@medusajs/ui"

interface DeclarativeFieldManagerProps {
  fields: FieldConfig[]
  onSave: (values: Record<string, any>) => void
  title?: string | null
  className?: string
  initialValues?: Record<string, any> | null
}

export const ManagerFields = ({ 
  fields, 
  onSave,
  title = "Fields",
  className = "",
  initialValues = {}
}: DeclarativeFieldManagerProps) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues || {})

  useEffect(() => {
    // Initialize values with defaults
    const defaultValues: Record<string, any> = {}
    const safeInitialValues = initialValues || {}
    
    fields.forEach(field => {
      if (safeInitialValues[field.key] !== undefined) {
        defaultValues[field.key] = safeInitialValues[field.key]
      } else if (field.defaultValue !== undefined) {
        defaultValues[field.key] = field.defaultValue
      } else {
        // Set appropriate default based on type
        switch (field.type) {
          case 'text':
          case 'textarea':
            defaultValues[field.key] = ""
            break
          case 'number':
            defaultValues[field.key] = 0
            break
          case 'checkbox':
            defaultValues[field.key] = false
            break
          case 'select':
            defaultValues[field.key] = field.options?.[0]?.value || ""
            break
        }
      }
    })
    setValues(defaultValues)
  }, [fields, initialValues])

  const handleFieldChange = (key: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    onSave(values)
  }

  const renderField = (field: FieldConfig) => {
    const value = values[field.key]

    switch (field.type) {
      case 'text':
        return (
          <FormField
            label={field.label}
            required={field.required}
          >
            <TextField
              label={field.label}
              value={value || ""}
              onChange={(value) => handleFieldChange(field.key, value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          </FormField>
        )
      case 'textarea':
        return (
          <FormField
            label={field.label}
            required={field.required}
          >
            <TextAreaField
              label={field.label}
              value={value || ""}
              onChange={(value) => handleFieldChange(field.key, value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          </FormField>
        )
      case 'number':
        return (
          <FormField
            label={field.label}
            required={field.required}
          >
            <NumberField
              label={field.label}
              value={value || 0}
              onChange={(value) => handleFieldChange(field.key, value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          </FormField>
        )
      case 'select':
        return (
          <FormField
            label={field.label}
            required={field.required}
          >
            <SelectField
              label={field.label}
              value={value || ""}
              onChange={(value) => handleFieldChange(field.key, value)}
              options={field.options || []}
              required={field.required}
            />
          </FormField>
        )
      case 'chip-input':
        return (
          <FormField
            label={field.label}
            required={field.required}
          >
            <ChipInput
              value={value || []} 
              onChange={(value) => handleFieldChange(field.key, value)}
              placeholder={field.placeholder}
              allowDuplicates={false}
              showRemove={true}
              variant="base"
            />
          </FormField>
        )
      case 'checkbox':
        return (
          <CheckboxField
            label={field.label}
            checked={value || false}
            onChange={(checked) => handleFieldChange(field.key, checked)}
            required={field.required}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={className}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            {renderField(field)}
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <Button
          onClick={handleSave}
          variant="primary"
          size="small"
        >
          Zapisz zmiany
        </Button>
      </div>
    </div>
  )
} 
