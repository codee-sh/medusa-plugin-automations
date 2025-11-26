import { model } from "@medusajs/framework/utils";
import { MpnNotificationTrigger } from "./mpn_notification_trigger";
import { MpnNotificationRuleValue } from "./mpn_notification_rule_value";

export const MpnNotificationRule = model
  .define("mpn_notification_rule", {
    id: model.id().primaryKey(),

    // E.g. "inventory_item.available_quantity"
    attribute: model.text(),

    // E.g. "eq" | "lte" | "gte" | "in" | "contains"
    operator: model.text(),

    // Human-readable description of the condition (optional)
    description: model.text().nullable(),

    metadata: model.json().nullable(),

    trigger: model.belongsTo(() => MpnNotificationTrigger, {
      mappedBy: "rules",
    }),

    rule_values: model.hasMany(() => MpnNotificationRuleValue, {
      mappedBy: "rule",
    }),
  });
