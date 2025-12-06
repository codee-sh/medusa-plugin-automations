import { useState, useEffect } from "react"
import { toast } from "@medusajs/ui"
import { ManagerFields } from "./manager-fields"
import { prepareMetadataForSave, filterEmptyMetadata } from "../../../lib/metadata-utils"
import { FieldConfig } from "./types"

interface EntityData {
  id: string
  metadata?: Record<string, any> | null
}

interface UniversalFieldsWidgetProps {
  entityId: string
  fields: FieldConfig[]
  title: string | null
  fetchEntity: (id: string) => Promise<EntityData>
  updateEntity: (id: string, metadata: Record<string, any>) => Promise<void>
}

export const FieldsWidget = ({ 
  entityId, 
  fields,
  title,
  fetchEntity,
  updateEntity
}: UniversalFieldsWidgetProps) => {
  const [entity, setEntity] = useState<EntityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadEntity = async () => {
      try {
        setLoading(true)
        const entityData = await fetchEntity(entityId)
        setEntity(entityData)
      } catch (error) {
        console.error("Error fetching entity:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEntity()
  }, [entityId, fetchEntity])

  const handleSave = async (values: Record<string, any>) => {
    if (!entity) return

    try {
      setSaving(true)
      
      // Use shared function to prepare metadata
      const updatedMetadata = prepareMetadataForSave(entity.metadata || {}, values)

      await updateEntity(entity.id, updatedMetadata)

      // Update local state
      setEntity(prev => prev ? ({
        ...prev,
        metadata: updatedMetadata
      }) : null)

      toast.success("Fields saved successfully!")
    } catch (error) {
      console.error("Error saving metadata:", error)
      toast.error("An error occurred while saving fields")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  if (!entity) {
    return <div className="p-4">Entity not found</div>
  }

  return (
    <ManagerFields
      fields={fields}
      title={title}
      initialValues={filterEmptyMetadata(entity.metadata || {})}
      onSave={handleSave}
    />
  )
} 
