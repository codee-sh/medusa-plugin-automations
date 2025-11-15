import { Button } from "@medusajs/ui"

interface SaveButtonProps {
  onSave: () => void
  disabled: boolean
}

export const SaveButton = ({ onSave, disabled }: SaveButtonProps) => {
  return (
    <div className="flex gap-4">
      <Button
        onClick={onSave}
        disabled={false}
        variant="primary"
        size="small"
      >
        Save images
      </Button>
    </div>
  )
} 
