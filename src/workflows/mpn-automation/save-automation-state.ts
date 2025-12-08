import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { saveAutomationStateStep } from "./steps/save-automation-state"

export type SaveAutomationStateWorkflowInput = {
  triggers: any
  targetKey?: string | null
  metadata?: Record<string, any> | null
}

export const saveAutomationStateWorkflow = createWorkflow(
  "save-automation-state",
  ({
    triggers,
    targetKey,
    metadata,
  }: SaveAutomationStateWorkflowInput) => {
    const getSaveAutomationStateResult =
      saveAutomationStateStep({
        triggers: triggers,
        targetKey: targetKey,
        metadata: metadata || {},
      })

    return new WorkflowResponse({
      statesSaved: getSaveAutomationStateResult,
    })
  }
)
