import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { editAutomationActionsStep } from "./steps/edit-automation-actions"
import { NotificationAction } from "../../modules/mpn-automation/interfaces"

export type EditAutomationActionsWorkflowInput = {
  trigger_id: string
  actions: NotificationAction[]
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

