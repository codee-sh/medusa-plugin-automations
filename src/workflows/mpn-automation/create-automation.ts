import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createAutomationStep } from "./steps/create-automation"
import { NotificationTrigger } from "../../modules/mpn-automation/interfaces"

export type CreateAutomationWorkflowInput = {
  items: NotificationTrigger[]
}

export const createAutomationWorkflow = createWorkflow(
  "create-automation",
  ({ items }: CreateAutomationWorkflowInput) => {
    const automation = createAutomationStep({
      items: items,
    })

    return new WorkflowResponse({
      automation,
    })
  }
)

