import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { editAutomationStep } from "./steps/edit-automation"
import { NotificationTrigger } from "../../modules/mpn-automation/types/interfaces"

export type EditAutomationWorkflowInput = {
  id: string
  items: NotificationTrigger[]
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
