import { baseAutomationFormSchema } from "../types";
import { z } from "zod";

// Function to create schema with dynamic validation based on availableActions
export function createAutomationFormSchema(availableActions?: Array<{
  value: string;
  label: string;
  fields?: Array<{
    name: string;
    key: string;
    label: string;
    type: string;
    required?: boolean;
    placeholder?: string;
  }>;
}>) {
  return baseAutomationFormSchema.superRefine((data, ctx) => {
    // Validate action config fields dynamically
    if (data.actions?.items && availableActions) {
      data.actions.items.forEach((action, index) => {
        if (!action.action_type) {
          return; // Skip if no action type selected
        }

        // Find action definition
        const actionDef = availableActions.find(
          (a) => a.value === action.action_type
        );

        if (!actionDef || !actionDef.fields) {
          return; // Skip if no fields defined
        }

        // Validate each required field
        actionDef.fields.forEach((field) => {
          if (field.required) {
            const fieldValue = action.config?.[field.name || field.key];

            if (!fieldValue || !String(fieldValue).trim()) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `${field.label} is required`,
                path: ["actions", "items", index, "config", field.name || field.key],
              });
            }
          }
        });
      });
    }
  });
}