import { z } from "zod"
import { automationFormSchema } from "./constants"

export type AutomationFormValues = z.infer<typeof automationFormSchema>
