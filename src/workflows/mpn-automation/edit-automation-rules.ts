import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { editAutomationRulesStep } from "./steps/edit-automation-rules"
import { AutomationRule } from "../../modules/mpn-automation/types/interfaces"

export type EditAutomationRulesWorkflowInput = {
  triggerId: string
  rules: AutomationRule[]
}

export const editAutomationRulesWorkflow = createWorkflow(
  "edit-automation-rules",
  ({
    triggerId,
    rules,
  }: EditAutomationRulesWorkflowInput) => {
    const automationRules = editAutomationRulesStep({
      trigger_id: triggerId,
      rules: rules,
    })

    return new WorkflowResponse({
      rules: automationRules,
    })
  }
)
