import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { editAutomationActionsStep } from "./steps/edit-automation-actions"

export type EditAutomationActionsWorkflowInput = {
  trigger_id: string
  actions: {
    id?: string
    action_type?: string
    config?: Record<string, any> | null
  }[]
}

export const editAutomationActionsWorkflow = createWorkflow(
  "edit-automation-actions",
  ({ trigger_id, actions }: EditAutomationActionsWorkflowInput) => {
    const automationActions = editAutomationActionsStep({
      trigger_id: trigger_id,
      actions: actions,
    })

    return new WorkflowResponse({
      actions: automationActions,
    })
  }
)

