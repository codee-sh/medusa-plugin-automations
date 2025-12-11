import { BaseActionHandler } from "./base-action-handler"

export class SlackActionHandler extends BaseActionHandler {
  id = "slack"
  label = "Slack"

  fields = [
    // Add templateName field - options will be populated dynamically by service based on eventName
    this.addTemplateNameField()
  ]
}
