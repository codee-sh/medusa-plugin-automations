import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { editAutomationRulesStep } from "./steps/edit-automation-rules"

export type EditAutomationRulesWorkflowInput = {
  trigger_id: string
  rules: {
    id?: string
    attribute?: string
    operator?: string
    description?: string | null
    metadata?: Record<string, any> | null
    rule_values?: {
      id?: string
      value?: string | null
      metadata?: Record<string, any> | null
    }[]
  }[]
}

export const editAutomationRulesWorkflow = createWorkflow(
  "edit-automation-rules",
  ({ trigger_id, rules }: EditAutomationRulesWorkflowInput) => {
    const automationRules = editAutomationRulesStep({
      trigger_id: trigger_id,
      rules: rules,
    })

    return new WorkflowResponse({
      rules: automationRules,
    })
  }
)

