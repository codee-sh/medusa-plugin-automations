import { useState } from "react"
import { Button, Input, Label } from "@medusajs/ui"

interface ImageUploaderProps {
  onAddImage: (imageUrl: string) => void
}

export const ImageUploader = ({ onAddImage }: ImageUploaderProps) => {
  const [newImageUrl, setNewImageUrl] = useState("")

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      onAddImage(newImageUrl)
      setNewImageUrl("")
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddImage()
    }
  }

  return (
    <div className="mb-6">
      <div className="mb-3">
        <Label className="text-sm font-medium">Add new image:</Label>
      </div>
      <div className="flex gap-2">
        <Input
          type="url"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Paste image URL..."
          className="flex-1"
        />
        <Button
          onClick={handleAddImage}
          disabled={!newImageUrl.trim()}
          variant="secondary"
          size="small"
        >
          Add
        </Button>
      </div>
    </div>
  )
} 
