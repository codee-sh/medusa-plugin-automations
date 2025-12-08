import { model } from "@medusajs/framework/utils"
import { MpnAutomationTrigger } from "./mpn_automation_trigger"

export const MpnAutomationAction = model
  .define("mpn_automation_action", {
    id: model.id().primaryKey(),

    position: model.number().default(1).nullable(),

    active: model.boolean().default(true),

    action_type: model.text().nullable(),

    config: model.json().nullable(),

    metadata: model.json().nullable(),

    trigger: model.belongsTo(() => MpnAutomationTrigger, {
      mappedBy: "actions",
    }),
  })
  .indexes([
    {
      on: ["position"],
    },
  ])
