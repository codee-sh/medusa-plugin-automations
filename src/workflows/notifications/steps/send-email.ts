import React from "react"
import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { getPluginOptions } from "@codee-sh/medusa-plugin-automations/utils/plugins"
import type {
  TemplateData,
  TemplateOptionsType,
} from "@codee-sh/medusa-plugin-notification-emails/templates/emails"
import MpnAutomationService from "../../../modules/mpn-automation/services/service"
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
  settings: SendEmailConfig
  templateData: TemplateData
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
 * - templateName: Required - Name of the email template to use
 * - to: Required - Recipient email address
 * - locale: Optional - Locale for translations (default: "pl")
 * - customTemplate: Optional - Path to custom template function
 * - subject: Optional - Custom subject (otherwise uses template default)
 * - template: Optional - Template identifier for notification (defaults to templateName)
 * - resourceId: Optional - Resource ID for notification tracking
 * - resourceType: Optional - Resource type for notification tracking
 *
 * @example
 * ```typescript
 * // Standalone usage
 * const result = await sendEmailStep({
 *   settings: {
 *     templateName: "inventory-level",
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
    const { settings, templateData, contextType, eventName } = input

    // Validate required config
    if (!settings.templateName) {
      return new StepResponse({
        success: false,
        error: "templateName is required in config",
      })
    }

    if (!settings.to) {
      return new StepResponse({
        success: false,
        error: "to (recipient email) is required in config",
      })
    }

    try {
      const notificationModuleService = container.resolve(
        Modules.NOTIFICATION
      )
      const pluginOptions = getPluginOptions(
        container,
        "@codee-sh/medusa-plugin-notification-emails"
      )

      const templateName = settings.templateName
      const to = settings.to
      const locale = settings.locale || "pl"
      const customSubject = settings.subject
      const resourceId = settings.resourceId || "unknown"
      const resourceType =
        settings.resourceType || "email.notification"
      const channel = settings.channel || "email"
      const triggerType = settings.triggerType || "system"

      // Prepare render options
      const renderOptions: TemplateOptionsType = {
        locale,
        theme: pluginOptions?.theme,
        customTranslations:
          pluginOptions?.customTranslations?.[templateName],
        contextType: contextType,
      }

      // Load custom template function if specified
      let customTemplateFunction:
        | ((
            data: TemplateData,
            options: TemplateOptionsType
          ) => React.ReactElement<any>)
        | undefined

      if (settings.customTemplate) {
        try {
          // Dynamic import of custom template
          // config.customTemplate should be a relative path like "../emails/pos-email-inventory"
          // or absolute path from project root like "src/emails/pos-email-inventory"
          const customTemplateModule = await import(
            settings.customTemplate
          )
          customTemplateFunction =
            customTemplateModule.default ||
            customTemplateModule.createCustomTemplate ||
            customTemplateModule.createTemplate

          if (!customTemplateFunction) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `Custom template module from ${settings.customTemplate} does not export a default function or createCustomTemplate/createTemplate`
            )
          }
        } catch (error: any) {
          if (error instanceof MedusaError) {
            throw error
          }
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Failed to load custom template from ${settings.customTemplate}: ${error?.message || "Unknown error"}`
          )
        }
      }

      // Use action handler for template rendering
      const mpnAutomationService = container.resolve<MpnAutomationService>(
        "mpnAutomation"
      )
      const emailHandler = mpnAutomationService.getActionHandler("email")
      
      if (!emailHandler?.handler?.renderTemplate) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Email action handler not found or does not support template rendering`
        )
      }

      const { html, text, subject } = await emailHandler.handler.renderTemplate({
        templateName: templateName,
        context: templateData,
        contextType: contextType,
        options: renderOptions,
      })

      // Send notification
      const notificationResult =
        await notificationModuleService.createNotifications(
          {
            to: to,
            channel: channel,
            template: settings.template || templateName,
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
