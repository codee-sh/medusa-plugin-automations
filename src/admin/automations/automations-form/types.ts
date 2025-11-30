import { z } from "zod"
import { ProgressStatus } from "@medusajs/ui"
import { automationFormSchema } from "./constants"

export type AutomationFormValues = z.infer<typeof automationFormSchema>

export enum Tab {
  GENERAL = "general",
  RULES = "rules",
  ACTIONS = "actions",
}

export type TabState = Record<Tab, ProgressStatus>