import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { deleteAutomationStep } from "./steps/delete-automation"

export type DeleteAutomationWorkflowInput = {
  id: string
}

export const deleteAutomationWorkflow = createWorkflow(
  "delete-automation",
  ({ id }: DeleteAutomationWorkflowInput) => {
    const result = deleteAutomationStep({
      id: id,
    })

    return new WorkflowResponse({
      result,
    })
  }
)

