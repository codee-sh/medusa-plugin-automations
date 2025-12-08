import { ImagesList } from "./images-list"

interface ImagesDisplayProps {
  images: any[]
  title?: string
  className?: string
  gridCols?: number
}

export const ImagesDisplay = ({
  images,
  title = "Zdjęcia",
  className = "",
  gridCols = 4,
}: ImagesDisplayProps) => {
  if (images.length === 0) {
    return null
  }

  const gridClass = `grid-cols-${gridCols}`

  return (
    <div
      className={`p-4 border rounded-lg bg-white ${className}`}
    >
      <h3 className="text-lg font-semibold mb-4">
        {title}
      </h3>
      <div
        className={`grid grid-cols-2 md:grid-cols-3 lg:${gridClass} gap-4`}
      >
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={
                typeof image === "string"
                  ? image
                  : image?.image_url || ""
              }
              alt={`Zdjęcie ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YWFhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJyYWsgemRqw7XDs2NpYTwvdGV4dD48L3N2Zz4="
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
