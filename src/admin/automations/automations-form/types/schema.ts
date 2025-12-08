import { z } from "zod"

// Base schema without dynamic validation
export const baseAutomationFormSchema = z.object({
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
    interval_minutes: z.number().nullable(),
    active: z.boolean(),
  }),
  rules: z
    .object({
      items: z.array(
        z.object({
          id: z.string().optional(),
          attribute: z
            .string()
            .min(1, "Attribute is required"),
          operator: z
            .string()
            .min(1, "Operator is required"),
          description: z.string().nullable().optional(),
          rule_values: z
            .array(
              z.object({
                id: z.string().optional(),
                value: z
                  .string()
                  .min(1, "Value is required"),
              })
            )
            .optional(),
        })
      ),
    })
    .optional(),
  actions: z
    .object({
      items: z
        .array(
          z.object({
            id: z.string().optional(),
            action_type: z
              .string()
              .min(1, "Action type is required"),
            config: z.record(z.any()),
          })
        )
        .optional(),
    })
    .optional(),
})
