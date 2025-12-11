import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createAutomationStep } from "./steps/create-automation"
import { AutomationTrigger } from "../../modules/mpn-automation/types/interfaces"

export type CreateAutomationWorkflowInput = {
  items: AutomationTrigger[]
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
