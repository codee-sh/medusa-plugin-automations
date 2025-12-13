import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import type { NotificationContent } from "@medusajs/framework/types"
import type { SlackBlock } from "../../../templates/slack/types"
import MpnAutomationService from "../../../modules/mpn-automation/services/service"
import { MedusaError } from "@medusajs/utils"

type SlackNotificationContent = NotificationContent & {
  blocks?: SlackBlock[]
}

export interface SendSlackConfig {
  template: string
  resourceId?: string
  resourceType?: string
  channel?: string
  triggerType?: string
  backendUrl?: string
  [key: string]: any // Allow additional config options
}

export interface SendSlackStepInput {
  settings: SendSlackConfig
  context: any
  eventName?: string
  contextType?: string | null
}

export interface SendSlackStepOutput {
  success: boolean
  notificationId?: string
  error?: string
}

export const sendSlackStepId = "send-slack"

/**
 * Universal step that sends a slack notification.
 *
 * This step can be used independently or as part of automation workflows.
 *
 * Configuration:
 * - templateName: Required - Name of the slack template to use
 *
 * @example
 * ```typescript
 * // Standalone usage
 * const result = await sendSlackStep({
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
export const sendSlackStep = createStep(
  sendSlackStepId,
  async (
    input: SendSlackStepInput,
    { container }
  ): Promise<StepResponse<SendSlackStepOutput>> => {
    const { settings, context, contextType, eventName } = input

    // Validate required config
    if (!settings.template) {
      return new StepResponse({
        success: false,
        error: "template is required in config",
      })
    }

    try {
      const notificationModuleService = container.resolve(
        Modules.NOTIFICATION
      )

      const template = settings.template
      const to = settings.to || "slack-channel"
      const locale = settings.locale || "pl"
      const resourceId = settings.resourceId || "unknown"
      const resourceType =
        settings.resourceType || "slack.notification"
      const channel = settings.channel || "slack"
      const triggerType = settings.triggerType || "system"
      const backendUrl = settings.backendUrl || ""

      // Use action handler for template rendering
      const mpnAutomationService = container.resolve<MpnAutomationService>(
        "mpnAutomation"
      )
      const slackHandler = mpnAutomationService.getActionHandler("slack")
      
      if (!slackHandler?.handler?.renderTemplate) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Slack action handler not found or does not support template rendering`
        )
      }

      const { text, blocks } = await slackHandler.handler.renderTemplate({
        templateName: template,
        context: context,
        contextType: contextType,
        options: {
          locale: locale,
          backendUrl: backendUrl,
        },
      })

      // Send notification
      const notificationResult =
        await notificationModuleService.createNotifications(
          {
            to: to,
            channel: channel,
            template: template,
            trigger_type: triggerType,
            resource_id: resourceId,
            resource_type: resourceType,
            data: {
              ...context,
            },
            content: {
              text: text,
              blocks,
            } as SlackNotificationContent,
          }
        )

      return new StepResponse({
        success: true,
        notificationId: notificationResult?.id,
      })
    } catch (error: any) {
      console.error(`Failed to send slack:`, error)
      return new StepResponse({
        success: false,
        error: error?.message || "Unknown error occurred",
      })
    }
  }
)
