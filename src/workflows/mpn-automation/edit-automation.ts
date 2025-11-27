import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { editAutomationStep } from "./steps/edit-automation"

export type EditAutomationWorkflowInput = {
  id: string
  items: {
    id: string
    name: string
  }[]
}

export const editAutomationWorkflow = createWorkflow(
  "edit-automation",
  ({ id, items }: EditAutomationWorkflowInput) => {
    const automation = editAutomationStep({
      items: items,
    })

    return new WorkflowResponse({
      automation,
    })
  }
)
