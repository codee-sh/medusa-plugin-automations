import { model } from "@medusajs/framework/utils";
import { MpnAutomationRule } from "./mpn_automation_rule";
import { MpnAutomationState } from "./mpn_automation_state";
import { MpnAutomationAction } from "./npm_automation_action";

export const MpnAutomationTrigger = model
  .define("mpn_automation_trigger", {
    id: model.id().primaryKey(),

    // Human-readable name for admin
    name: model.text(),

    // Description (optional)
    description: model.text().nullable(),

    // Activation type: event / schedule / manual
    trigger_type: model.enum(["event", "schedule", "manual"]),

    // Event name — only when trigger_type = "event"
    event_name: model.text().nullable(),

    // Interval in minutes — only when trigger_type = "schedule"
    interval_minutes: model.number().nullable(),

    // When the trigger was last run (schedule)
    last_run_at: model.dateTime().nullable(),

    // Whether the trigger is enabled
    active: model.boolean().default(true),

    // Delivery channels — JSON
    // e.g. { email: true, slack: false, admin: true }
    channels: model.json().nullable(),

    // Additional metadata
    metadata: model.json().nullable(),

    rules: model.hasMany(() => MpnAutomationRule, {
      mappedBy: "trigger",
    }),

    states: model.hasMany(() => MpnAutomationState, {
      mappedBy: "trigger",
    }),

    actions: model.hasMany(() => MpnAutomationAction, {
      mappedBy: "trigger",
    }),
  })
  .indexes([
    {
      on: ["id"],
      unique: true,
    },
    {
      on: ["trigger_type"],
    },
    {
      on: ["event_name"],
    }
  ]);

