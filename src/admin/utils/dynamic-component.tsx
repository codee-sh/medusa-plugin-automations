import { useState, useEffect } from "react"
import { loadTemplateComponent } from "./template"

export default function LoadActionComponent({
  actionType,
  configComponentKey,
  form,
  name,
  errors,
  fields,
}: {
  actionType: string
  configComponentKey?: string
  form: any
  name: any
  errors?: Record<string, string>
  fields?: any
}) {
  const [Component, setComponent] =
    useState<React.ComponentType<any> | null>(
      null
    )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!actionType || !configComponentKey) {
      setComponent(null)
      return
    }

    setLoading(true)
    setError(null)

    loadTemplateComponent(configComponentKey as any)
      .then((module) => {
        const Component = module
        
        if (Component) {
          setComponent(() => Component as any)
        } else {
          setError(
            `Component not found in ${configComponentKey}`
          )
        }
      })
      .catch((err) => {
        console.error(
          `Failed to load component from ${configComponentKey}:`,
          err
        )
        setError(`Failed to load component: ${err.message}`)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [actionType, configComponentKey])

  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        Loading configuration...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-sm text-red-500">
        Error: {error}
      </div>
    )
  }

  if (!Component) {
    return null
  }

  return (
    <Component
      form={form}
      name={name}
      errors={errors}
      fields={fields}
    />
  )
}
