import { ManagerFields } from "../../components/manager-fields/manager-fields"

function BaseConfigComponent({
  form,
  fields,
  name,
  errors,
}: any) {
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
