import { z } from "zod"
import { ProgressStatus } from "@medusajs/ui"
import { baseAutomationFormSchema } from "./schema"

export type AutomationFormValues = z.infer<
  typeof baseAutomationFormSchema
>

export enum Tab {
  GENERAL = "general",
  RULES = "rules",
  ACTIONS = "actions",
}

export type TabState = Record<Tab, ProgressStatus>
