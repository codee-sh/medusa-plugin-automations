import { z } from "zod";

export const automationFormSchema = z.object({
  general: z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(3, "Name must be at least 3 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .min(3, "Description must be at least 3 characters"),
    trigger_type: z.enum(["event", "schedule", "manual"]),
    event_name: z.string().min(1, "Event name is required"),
    interval_minutes: z.string().optional(),
    active: z.boolean(),
    channels: z.record(z.boolean()).nullable(),
  }),
  rules: z
    .object({
      items: z
        .array(
          z.object({
            // ... definicje dla rules
          })
        )
        .optional(),
    })
    .optional(),
  actions: z
    .object({
      items: z
        .array(
          z.object({
            // ... definicje dla actions
          })
        )
        .optional(),
    })
    .optional(),
});
