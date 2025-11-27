import { model } from "@medusajs/framework/utils";
import { MpnAutomationTrigger } from "./mpn_automation_trigger";
import { MpnAutomationRuleValue } from "./mpn_automation_rule_value";

export const MpnAutomationRule = model
  .define("mpn_automation_rule", {
    id: model.id().primaryKey(),

    // E.g. "inventory_item.available_quantity"
    attribute: model.text(),

    // E.g. "eq" | "lte" | "gte" | "in" | "contains"
    operator: model.text(),

    // Human-readable description of the condition (optional)
    description: model.text().nullable(),

    metadata: model.json().nullable(),

    trigger: model.belongsTo(() => MpnAutomationTrigger, {
      mappedBy: "rules",
    }),

    rule_values: model.hasMany(() => MpnAutomationRuleValue, {
      mappedBy: "rule",
    }),
  });

