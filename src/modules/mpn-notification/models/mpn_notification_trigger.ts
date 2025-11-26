import { model } from "@medusajs/framework/utils";
import { MpnNotificationRule } from "./mpn_notification_rule";

export const MpnNotificationTrigger = model
  .define("mpn_notification_trigger", {
    id: model.id().primaryKey(),

    // Unique code identifying the trigger function
    trigger_id: model.text(),

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

    rules: model.hasMany(() => MpnNotificationRule, {
      mappedBy: "trigger",
    }),
  })
  .indexes([
    {
      on: ["trigger_id"],
      unique: true,
    },
    {
      on: ["trigger_type"],
    },
    {
      on: ["event_name"],
    }
  ]);
