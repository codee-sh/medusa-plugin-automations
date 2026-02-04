import { FieldConfig } from "../types"
import { BaseActionService } from "./base-action-service"
import { transformContext } from "@codee-sh/medusa-plugin-notification-emails/utils"
import { emailServiceWorkflow } from "@codee-sh/medusa-plugin-notification-emails/workflows/mpn-builder-services/email-service"

import type {
  TemplateData,
  TemplateOptionsType,
} from "@codee-sh/medusa-plugin-notification-emails/templates/emails"
import React from "react"
import { getServicesTypesTemplatesWorkflow } from "@codee-sh/medusa-plugin-notification-emails/workflows/mpn-builder/get-services-types-templates"

export class EmailActionService extends BaseActionService {
  id = "email"
  label = "Email"
  container_: any
  enabled = true

  constructor({ events }: { events?: any }) {
    super()
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

  async fetchData(params: {
    container: any
  }): Promise<any> {
    const { result: { templates: allTemplates } } = await getServicesTypesTemplatesWorkflow(params.container).run({
      input: {
        service_id: this.id,
      },
    })

    // If service_id was provided, allTemplates will contain only one item
    const filteredTemplate = allTemplates.length > 0 ? allTemplates[0] : null
    const templates = filteredTemplate ? filteredTemplate.templates.db : []
    const templatesNew = filteredTemplate ? filteredTemplate.templates : []

    const newFieldsNew = this.fillTemplateNameFieldWithOptions(this.fields, [
      {
        groupName: "System",
        options: templatesNew.system.map((template: any) => ({
          value: template.id,
          name: template.name,
        })),
      },
      {
        groupName: "Database",
        options: templatesNew.db.map((template: any) => ({
          value: template.id,
          name: template.label,
        })),
      },
    ])

    return {
      value: this.id,
      label: this.label,
      description: this.description,
      configComponentKey: this.configComponentKey,
      fields: newFieldsNew,   
      templates: templates,
      enabled: this.enabled,
    }
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
    container?: any
    customTemplateFunction?: (
      data: TemplateData,
      options: TemplateOptionsType
    ) => React.ReactElement<any>
  }): Promise<{
    html: string
    text: string
    subject: string
  }> {
    const {
      templateName,
      context,
      contextType,
      options,
      customTemplateFunction,
      container,
    } = params

    const transformedContext = transformContext(contextType, context)

    const { result: { html, text, subject } } = await emailServiceWorkflow(container).run({
      input: {
        template_id: templateName,
        data: transformedContext,
        options: {
          ...(options || {}),
          customTemplateFunction,
        },
      },
    })

    return {
      html: html,
      text: text,
      subject: subject,
    }
  }
}
