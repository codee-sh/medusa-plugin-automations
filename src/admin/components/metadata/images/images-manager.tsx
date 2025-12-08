import { useState, useEffect } from "react"
import { Select, Label } from "@medusajs/ui"
import {
  ImageUploader,
  ImagesList,
  SaveButton,
} from "./index"

interface ImagesManagerProps {
  images: any[]
  onImagesChange: (images: any[]) => void
  onSave?: () => void
  title?: string
  showSaveButton?: boolean
  className?: string
  sectionType?: string
  onSectionTypeChange?: (type: string) => void
  sectionTypes?: Array<{ value: string; label: string }>
}

export const ImagesManager = ({
  images,
  onImagesChange,
  onSave,
  title = "Zarządzanie zdjęciami",
  showSaveButton = true,
  className = "",
  sectionType = "slider",
  onSectionTypeChange,
  sectionTypes = [],
}: ImagesManagerProps) => {
  const handleAddImage = (imageUrl: string) => {
    if (imageUrl.trim()) {
      onImagesChange([
        ...images,
        { image_url: imageUrl.trim() },
      ])
    }
  }

  const handleRemoveImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  const handleSectionTypeChange = (value: string) => {
    if (onSectionTypeChange) {
      onSectionTypeChange(value)
    }
  }

  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold mb-4">
          {title}
        </h3>
      )}

      {/* Section type selection */}
      {onSectionTypeChange && (
        <div className="mb-6">
          <div className="mb-2">
            <Label className="text-sm font-medium">
              Section type:
            </Label>
          </div>
          <Select
            value={sectionType}
            onValueChange={handleSectionTypeChange}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {sectionTypes.map((type) => (
                <Select.Item
                  key={type.value}
                  value={type.value}
                >
                  {type.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
      )}

      <ImageUploader onAddImage={handleAddImage} />

      <ImagesList
        images={images}
        onRemoveImage={handleRemoveImage}
      />

      {showSaveButton && onSave && (
        <SaveButton onSave={onSave} disabled={false} />
      )}
    </div>
  )
}
