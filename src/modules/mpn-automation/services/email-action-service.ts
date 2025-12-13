import { FieldConfig } from "../types"
import { BaseActionService } from "./base-action-service"
import { renderTemplate } from "@codee-sh/medusa-plugin-notification-emails/templates/emails"
import type {
  TemplateData,
  TemplateOptionsType,
} from "@codee-sh/medusa-plugin-notification-emails/templates/emails"
import React from "react"

export class EmailActionService extends BaseActionService {
  id = "email"
  label = "Email"

  constructor() {
    super()
    this.initializeTemplates()
  }

  fields: FieldConfig[] = [
    {
      name: "to",
      key: "to",
      label: "To",
      type: "email" as const,
      required: true,
    },
    {
      name: "subject",
      key: "subject",
      label: "Subject",
      type: "text" as const,
      required: true,
    },
    {
      name: "body",
      key: "body",
      label: "Body",
      type: "textarea" as const,
      required: true,
    },
    {
      name: "bcc",
      key: "bcc",
      label: "BCC",
      type: "email" as const,
      required: false,
    },
    {
      name: "cc",
      key: "cc",
      label: "CC",
      type: "email" as const,
      required: false,
    },
    {
      name: "replyTo",
      key: "replyTo",
      label: "Reply To",
      type: "email" as const,
      required: false,
    },
    // Add templateName field - options will be populated dynamically by service based on eventName
    this.addTemplateNameField(),
  ]

  /**
   * Initialize default email templates
   * Email templates are managed by @codee-sh/medusa-plugin-notification-emails
   * This method can be used to register custom templates if needed
   */
  protected initializeTemplates(): void {
    // Email templates are handled by external plugin
    // Custom templates can be registered here if needed
  }

  /**
   * Render email template using external plugin
   * @param params - Template rendering parameters
   * @returns Rendered email template with html, text, and subject
   */
  async renderTemplate(params: {
    templateName: string
    context: TemplateData
    contextType?: string | null
    options?: TemplateOptionsType
    customTemplateFunction?: (
      data: TemplateData,
      options: TemplateOptionsType
    ) => React.ReactElement<any>
  }): Promise<{ html: string; text: string; subject: string }> {
    const { templateName, context, options, customTemplateFunction } = params

    // Use external plugin's renderTemplate function
    const result = await renderTemplate(
      templateName,
      context,
      options || {},
      customTemplateFunction
    )

    return result
  }
}
