import { Button } from "@medusajs/ui"

interface SaveFieldsButtonProps {
  onSave: () => void
  disabled: boolean
}

export const SaveFieldsButton = ({ onSave, disabled }: SaveFieldsButtonProps) => {
  return (
    <div className="flex gap-4">
      <Button
        onClick={onSave}
        disabled={false}
        variant="primary"
        size="small"
      >
        Save fields
      </Button>
    </div>
  )
} 
