import { FieldConfig } from "../types"
import { BaseActionHandler } from "./base-action-handler"

export class SlackActionHandler extends BaseActionHandler {
  id = "slack"
  label = "Slack"

  fields: FieldConfig[] = [
    {
      name: "templateName",
      key: "templateName",
      label: "Template Name",
      type: "select" as const,
      required: true,
      options: [
        {
          label: "Inventory Level",
          value: "inventory-level",
        },
      ],
      defaultValue: "inventory-level",
    }
  ]
}
