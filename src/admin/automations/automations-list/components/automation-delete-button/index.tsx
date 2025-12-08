import { Button, usePrompt, toast } from "@medusajs/ui"
import { useQueryClient } from "@tanstack/react-query"
import { useDeleteAutomation } from "../../../../../hooks/api/automations"
import { Trash } from "@medusajs/icons"

export const AutomationDeleteButton = ({
  id,
}: {
  id: string
}) => {
  const queryClient = useQueryClient()
  const prompt = usePrompt()

  const { mutate: deleteAutomation } = useDeleteAutomation()

  const handleDelete = async () => {
    await deleteAutomation(
      { id: id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["automations"],
          })
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }

  const handleDeleteConfirmation = async () => {
    const result = await prompt({
      title:
        "Are you sure you want to delete this automation?",
      description: "This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
    })

    if (result) {
      handleDelete()
    }
  }

  return (
    <Button
      size="small"
      variant="primary"
      onClick={handleDeleteConfirmation}
    >
      <Trash className="w-4 h-4" />
    </Button>
  )
}
