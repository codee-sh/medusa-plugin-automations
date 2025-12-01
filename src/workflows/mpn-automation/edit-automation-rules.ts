import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { editAutomationRulesStep } from "./steps/edit-automation-rules" 
import { NotificationRule } from "../../modules/mpn-automation/interfaces"

export type EditAutomationRulesWorkflowInput = {
  trigger_id: string
  rules: NotificationRule[]
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

