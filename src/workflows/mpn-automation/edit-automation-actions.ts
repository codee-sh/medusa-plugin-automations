import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { editAutomationActionsStep } from "./steps/edit-automation-actions"
import { NotificationAction } from "../../modules/mpn-automation/types/interfaces"

export type EditAutomationActionsWorkflowInput = {
  triggerId: string
  actions: NotificationAction[]
}

export const editAutomationActionsWorkflow = createWorkflow(
  "edit-automation-actions",
  ({ triggerId, actions }: EditAutomationActionsWorkflowInput) => {
    const automationActions = editAutomationActionsStep({
      trigger_id: triggerId,
      actions: actions,
    })

    return new WorkflowResponse({
      actions: automationActions,
    })
  }
)

