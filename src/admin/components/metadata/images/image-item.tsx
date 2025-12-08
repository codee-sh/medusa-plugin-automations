import { Button, IconButton } from "@medusajs/ui"
import { Trash } from "@medusajs/icons"

interface ImageItemProps {
  image: any
  index: number
  onRemove: () => void
}

export const ImageItem = ({
  image,
  index,
  onRemove,
}: ImageItemProps) => {
  // Function to get image URL
  const getImageUrl = (image: any) => {
    // If image is string (URL), return it directly
    if (typeof image === "string") {
      return image
    }
    // If image is object with image_url, return image_url
    if (typeof image === "object" && image?.image_url) {
      return image.image_url
    }
    // Fallback
    return ""
  }

  return (
    <div className="relative group">
      <img
        src={getImageUrl(image)}
        alt={`Image ${index + 1}`}
        className="w-full h-32 object-cover rounded-lg border"
        onError={(e) => {
          e.currentTarget.src =
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YWFhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJyYWsgemRqw7XDs2NpYTwvdGV4dD48L3N2Zz4="
        }}
      />
      <IconButton
        onClick={onRemove}
        variant="transparent"
        size="small"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white"
        title="Remove image"
      >
        <Trash />
      </IconButton>
    </div>
  )
}
