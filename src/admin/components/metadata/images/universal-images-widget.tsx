import { useState, useEffect } from "react"
import { toast } from "@medusajs/ui"
import { ImagesManager } from "./index"
import { prepareMetadataForSave } from "../../../lib/metadata-utils"

interface EntityData {
  id: string
  metadata?: Record<string, any> | null
}

interface ImageData {
  image_url: string
}

interface SectionType {
  value: string
  label: string
}

interface UniversalImagesWidgetProps {
  entityId: string
  fetchEntity: (id: string) => Promise<EntityData>
  updateEntity: (id: string, metadata: Record<string, any>) => Promise<void>
  sectionTypes?: SectionType[]
  defaultSectionType?: string
  title?: string
}

export const UniversalImagesWidget = ({ 
  entityId,
  fetchEntity,
  updateEntity,
  sectionTypes = [{ value: 'slider', label: 'Slider główny' }],
  defaultSectionType = "slider",
  title = "Images"
}: UniversalImagesWidgetProps) => {
  const [entity, setEntity] = useState<EntityData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [images, setImages] = useState<ImageData[]>([])
  const [sectionType, setSectionType] = useState(defaultSectionType)

  useEffect(() => {
    const loadEntity = async () => {
      try {
        const entityData = await fetchEntity(entityId)
        setEntity(entityData)
        const existingImages = entityData?.metadata?.[sectionType] || []
        // Check if field is empty string (indicates removed images)
        const isEmpty = existingImages === ""
        setImages(Array.isArray(existingImages) && !isEmpty ? existingImages : [])
      } catch (error) {
        console.error("Error fetching entity:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEntity()
  }, [entityId, sectionType, fetchEntity])

  const handleSectionTypeChange = (newSectionType: string) => {
    setSectionType(newSectionType)
  }

  const handleSaveImages = async (): Promise<void> => {
    if (!entity) return

    try {
      // Use shared function to prepare metadata
      const values: Record<string, any> = {}
      values[sectionType] = images.length === 0 ? "" : images
      const updatedMetadata = prepareMetadataForSave(entity.metadata || {}, values)

      await updateEntity(entity.id, updatedMetadata)

      setEntity((prev: EntityData | null) => prev ? ({
        ...prev,
        metadata: updatedMetadata
      }) : null)

      toast.success("Images saved successfully!")
    } catch (error) {
      console.error("Error saving images:", error)
      toast.error("An error occurred while saving images")
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <ImagesManager
      images={images}
      onImagesChange={setImages}
      onSave={handleSaveImages}
      title={title}
      showSaveButton={true}
      sectionType={sectionType}
      onSectionTypeChange={handleSectionTypeChange}
      sectionTypes={sectionTypes}
    />
  )
} 
