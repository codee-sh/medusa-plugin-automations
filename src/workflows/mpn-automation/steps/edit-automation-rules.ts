import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import MpnAutomationService from "../../../modules/mpn-automation/services/service"
import { MPN_AUTOMATION_MODULE } from "../../../modules/mpn-automation"

type EditAutomationRulesStepInput = {
  trigger_id: string
  rules: {
    id?: string
    attribute?: string
    operator?: string
    metadata?: Record<string, any> | null
    rule_values?: {
      id?: string
      value?: string | null
      metadata?: Record<string, any> | null
    }[]
  }[]
}

export const editAutomationRulesStep = createStep(
  "edit-automation-rules",
  async ({ trigger_id, rules }: EditAutomationRulesStepInput, { container }) => {
    const mpnAutomationService: MpnAutomationService = container.resolve(MPN_AUTOMATION_MODULE)

    console.log("editAutomationRulesStep", { trigger_id, rules })

    // Get existing rules for this trigger
    const existingRules = await mpnAutomationService.listMpnAutomationRules(
      {
        trigger_id: trigger_id,
      },
      {
        relations: ["rule_values"],
      }
    )

    const existingRuleIds = existingRules.map((rule: any) => rule.id)
    const incomingRuleIds = rules.filter((rule) => rule.id).map((rule) => rule.id)

    // Find rules to delete (existing but not in new data)
    const rulesToDelete = existingRuleIds.filter(
      (id: string) => !incomingRuleIds.includes(id)
    )

    // Delete rules that are no longer in the data
    if (rulesToDelete.length > 0) {
      await mpnAutomationService.deleteMpnAutomationRules(rulesToDelete)
    }

    // Update or create rules
    const updatedRules = await Promise.all(
      rules.map(async (rule) => {
        const ruleData: any = {
          trigger_id: trigger_id,
          attribute: rule.attribute,
          operator: rule.operator
        }

        if (rule?.id) {
          // Update existing rule
          const updatedRule = await mpnAutomationService.updateMpnAutomationRules([
            {
              id: rule.id,
              ...ruleData,
            },
          ])

          // Find existing rule with values
          const existingRule = existingRules.find((r: any) => r.id === rule.id)
          const existingValueIds = existingRule?.rule_values?.map((v: any) => v.id) || []
          const incomingValueIds = (rule.rule_values || [])
            .filter((v) => v.id)
            .map((v) => v.id as string)

          // Delete values that are no longer in the data
          const valuesToDelete = existingValueIds.filter(
            (id: string) => !incomingValueIds.includes(id)
          )
          if (valuesToDelete.length > 0) {
            await mpnAutomationService.deleteMpnAutomationRuleValues(valuesToDelete)
          }

          // Update or create rule values
          if (rule.rule_values && rule.rule_values.length > 0) {
            const valuesToUpdate = rule.rule_values.filter((v) => v.id)
            const valuesToCreate = rule.rule_values.filter((v) => !v.id)

            if (valuesToUpdate.length > 0) {
              await mpnAutomationService.updateMpnAutomationRuleValues(
                valuesToUpdate.map((value) => ({
                  id: value.id!,
                  rule_id: rule.id!,
                  value: value.value
                }))
              )
            }

            if (valuesToCreate.length > 0) {
              await mpnAutomationService.createMpnAutomationRuleValues(
                valuesToCreate.map((value) => ({
                  rule_id: rule.id!,
                  value: value.value
                }))
              )
            }
          }

          return updatedRule[0]
        } else {
          // Create new rule
          const newRule = await mpnAutomationService.createMpnAutomationRules([ruleData])

          // Create rule values if they exist
          if (rule?.rule_values && rule?.rule_values.length > 0) {
            await mpnAutomationService.createMpnAutomationRuleValues(
              rule.rule_values.map((value) => ({
                rule_id: newRule[0].id,
                value: value.value
              }))
            )
          }

          return newRule[0]
        }
      })
    )

    return new StepResponse(updatedRules, updatedRules)
  }
)

