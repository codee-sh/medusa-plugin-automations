import { Label, Input, Textarea } from "@medusajs/ui"
import { Controller } from "react-hook-form"
import { ActionConfigComponentProps } from "../../../modules/mpn-automation/types/action-handler"
import { ManagerFields } from "../../components/manager-fields/manager-fields"

function BaseConfigComponent({
  form,
  fields,
  name,
  errors,
}: ActionConfigComponentProps) {
  return (
    <ManagerFields
      name={name}
      form={form}
      fields={fields}
      errors={errors}
    />
  )
}

// Export as default for dynamic import
export default BaseConfigComponent

// Also export as named export for backward compatibility
export { BaseConfigComponent }
