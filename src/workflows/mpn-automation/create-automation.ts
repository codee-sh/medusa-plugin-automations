import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createAutomationStep } from "./steps/create-automation"

export type CreateAutomationWorkflowInput = {
  items: {
    name: string
    description: string
    trigger_type: "event" | "schedule" | "manual"
    event_name: string
    interval_minutes: number
    active: boolean
    channels: Record<string, boolean>
  }[]
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

