import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { MedusaError } from "@medusajs/utils"
import type { NotificationContent } from "@medusajs/framework/types"
import MpnAutomationService from "../../../modules/mpn-automation/service"

type SlackNotificationContent = NotificationContent & {
  blocks?: any[]
}

export interface SendSlackOptions {
  templateName: string
  resourceId?: string
  resourceType?: string
  channel?: string
  triggerType?: string
  [key: string]: any // Allow additional config options
}

export interface SendSlackStepInput {
  options: SendSlackOptions
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
    const { options, context, contextType, eventName } =
      input

    // Validate required config
    if (!options.templateName) {
      return new StepResponse({
        success: false,
        error: "templateName is required in config",
      })
    }

    try {
      const notificationModuleService = container.resolve(
        Modules.NOTIFICATION
      )

      const templateName = options.templateName
      const to = options.to || "slack-channel"
      const locale = options.locale || "pl"
      const resourceId = options.resourceId || "unknown"
      const resourceType = options.resourceType || "slack.notification"
      const channel = "slack"
      const triggerType = options.triggerType || "system"

      // Use action handler for template rendering
      const mpnAutomationService =
        container.resolve<MpnAutomationService>(
          "mpnAutomation"
        )
      const slackHandler =
        mpnAutomationService.getActionHandler("slack")

      if (!slackHandler?.handler?.renderTemplate) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Slack action handler not found or does not support template rendering`
        )
      }

      const { text, blocks } =
        await slackHandler.handler.renderTemplate({
          templateName: templateName,
          context: context,
          contextType: contextType,
          options: {
            locale: locale
          },
          container: container
        })

      // Send notification
      const notificationResult =
        await notificationModuleService.createNotifications(
          {
            to: to,
            channel: channel,
            template: templateName,
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
