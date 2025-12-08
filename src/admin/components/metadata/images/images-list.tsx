import { Heading } from "@medusajs/ui"
import { ImageItem } from "./index"

interface ImagesListProps {
  images: any[]
  onRemoveImage: (index: number) => void
}

export const ImagesList = ({
  images,
  onRemoveImage,
}: ImagesListProps) => {
  if (images.length === 0) {
    return null
  }

  return (
    <div className="mb-6">
      <div className="mb-3">
        <Heading level="h3" className="text-md font-medium">
          Images list:
        </Heading>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <ImageItem
            key={index}
            image={image}
            index={index}
            onRemove={() => onRemoveImage(index)}
          />
        ))}
      </div>
    </div>
  )
}
