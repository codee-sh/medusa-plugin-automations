import { model } from "@medusajs/framework/utils"
import { MpnAutomationTrigger } from "./mpn_automation_trigger"

export const MpnAutomationState = model.define(
  "mpn_automation_state",
  {
    id: model.id().primaryKey(),

    target_key: model.text().nullable(),

    metadata: model.json().nullable(),

    // When the state was last updated
    last_triggered_at: model.dateTime().nullable(),

    trigger: model.belongsTo(() => MpnAutomationTrigger, {
      mappedBy: "states",
    }),
  }
)
