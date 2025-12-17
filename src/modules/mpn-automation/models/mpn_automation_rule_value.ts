import { model } from "@medusajs/framework/utils"
import { MpnAutomationRule } from "./mpn_automation_rule"

export const MpnAutomationRuleValue = model.define(
  "mpn_automation_rule_value",
  {
    id: model.id().primaryKey(),

    // Value can be string, number, or array (for array operators like contains)
    value: model.json().nullable(),

    metadata: model.json().nullable(),

    rule: model.belongsTo(() => MpnAutomationRule, {
      mappedBy: "rule_values",
    }),
  }
)
