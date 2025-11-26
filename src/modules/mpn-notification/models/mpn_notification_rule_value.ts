import { model } from "@medusajs/framework/utils";
import { MpnNotificationRule } from "./mpn_notification_rule";

export const MpnNotificationRuleValue = model
  .define("mpn_notification_rule_value", {
    id: model.id().primaryKey(),

    value: model.text().nullable(),

    metadata: model.json().nullable(),

    rule: model.belongsTo(() => MpnNotificationRule, {
      mappedBy: "rule_values",
    })
  });
