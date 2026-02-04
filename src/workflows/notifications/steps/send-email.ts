import React from "react"
import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
// import { getPluginOptions } from "@codee-sh/medusa-plugin-automations/utils/plugins"
// import type {
//   TemplateData,
//   TemplateOptionsType,
// } from "@codee-sh/medusa-plugin-notification-emails/templates/emails"
import MpnAutomationService from "../../../modules/mpn-automation/service"
import { MedusaError } from "@medusajs/utils"

export interface SendEmailConfig {
  templateName: string
  to: string
  locale?: string
  subject?: string
  customTemplate?: string
  template?: string
  resourceId?: string
  resourceType?: string
  channel?: string
  triggerType?: string
  [key: string]: any // Allow additional config options
}

export interface SendEmailStepInput {
  options: SendEmailConfig
  templateData: any
  eventName?: string
  contextType?: string | null
}

export interface SendEmailStepOutput {
  success: boolean
  notificationId?: string
  error?: string
}

export const sendEmailStepId = "send-email"

/**
 * Universal step that sends an email notification.
 *
 * This step can be used independently or as part of automation workflows.
 *
 * Configuration:
 * - templateId: Required - ID or name of the email template to use
 * - to: Required - Recipient email address
 * - locale: Optional - Locale for translations (default: "pl")
 * - subject: Optional - Custom subject (otherwise uses template default)
 * - template: Optional - Template identifier for notification (defaults to templateName)
 * - resourceId: Optional - Resource ID for notification tracking
 * - resourceType: Optional - Resource type for notification tracking
 *
 * @example
 * ```typescript
 * // Standalone usage
 * const result = await sendEmailStep({
 *   options: {
 *     templateId: "inventory-level",
 *     to: "admin@example.com",
 *     locale: "pl"
 *   },
 *   templateData: {
 *     inventory_level: { ... }
 *   }
 * })
 * ```
 */
export const sendEmailStep = createStep(
  sendEmailStepId,
  async (
    input: SendEmailStepInput,
    { container }
  ): Promise<StepResponse<SendEmailStepOutput>> => {
    const {
      options,
      templateData,
      contextType,
      eventName,
    } = input

    // Validate required config
    if (!options.templateName) {
      return new StepResponse({
        success: false,
        error: "templateName is required in config",
      })
    }

    if (!options.to) {
      return new StepResponse({
        success: false,
        error: "to (recipient email) is required in config",
      })
    }

    try {
      const notificationModuleService = container.resolve(
        Modules.NOTIFICATION
      )

      const templateName = options.templateName
      const to = options.to
      const locale = options.locale || "pl"
      const customSubject = options.subject
      const resourceId = options.resourceId || "unknown"
      const resourceType =
        options.resourceType || "email.notification"
      const channel = options.channel || "email"
      const triggerType = options.triggerType || "system"

      // // Prepare render options
      // const renderOptions: TemplateOptionsType = {
      //   locale,
      //   theme: pluginOptions?.theme,
      //   customTranslations:
      //     pluginOptions?.customTranslations?.[templateName],
      //   contextType: contextType,
      // }

      // Load custom template function if specified
      // let customTemplateFunction:
      //   | ((
      //       data: TemplateData,
      //       options: TemplateOptionsType
      //     ) => React.ReactElement<any>)
      //   | undefined

      // if (options.customTemplate) {
      //   try {
      //     // Dynamic import of custom template
      //     // config.customTemplate should be a relative path like "../emails/pos-email-inventory"
      //     // or absolute path from project root like "src/emails/pos-email-inventory"
      //     const customTemplateModule = await import(
      //       options.customTemplate
      //     )
      //     customTemplateFunction =
      //       customTemplateModule.default ||
      //       customTemplateModule.createCustomTemplate ||
      //       customTemplateModule.createTemplate

      //     if (!customTemplateFunction) {
      //       throw new MedusaError(
      //         MedusaError.Types.INVALID_DATA,
      //         `Custom template module from ${options.customTemplate} does not export a default function or createCustomTemplate/createTemplate`
      //       )
      //     }
      //   } catch (error: any) {
      //     if (error instanceof MedusaError) {
      //       throw error
      //     }
      //     throw new MedusaError(
      //       MedusaError.Types.INVALID_DATA,
      //       `Failed to load custom template from ${options.customTemplate}: ${error?.message || "Unknown error"}`
      //     )
      //   }
      // }

      // Use action handler for template rendering
      const mpnAutomationService =
        container.resolve<MpnAutomationService>(
          "mpnAutomation"
        )
      const emailHandler =
        mpnAutomationService.getActionHandler("email")

      if (!emailHandler?.handler?.renderTemplate) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Email action handler not found or does not support template rendering`
        )
      }

      const { html, text, subject } =
        await emailHandler.handler.renderTemplate({
          templateName: templateName,
          context: templateData,
          contextType: contextType,
          options: {
            locale: locale,
          },
          container: container,
        })

      // Send notification
      const notificationResult =
        await notificationModuleService.createNotifications(
          {
            to: to,
            channel: channel,
            template: options.template || templateName,
            trigger_type: triggerType,
            resource_id: resourceId,
            resource_type: resourceType,
            data: templateData,
            content: {
              subject: customSubject || subject,
              html: html,
              text: text,
            },
          }
        )

      return new StepResponse({
        success: true,
        notificationId: notificationResult?.id,
      })
    } catch (error: any) {
      console.error(`Failed to send email:`, error)
      return new StepResponse({
        success: false,
        error: error?.message || "Unknown error occurred",
      })
    }
  }
)
