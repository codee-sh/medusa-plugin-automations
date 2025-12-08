import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export interface SendSlackConfig {
  template: string
  resourceId?: string
  resourceType?: string
  channel?: string
  triggerType?: string
  [key: string]: any // Allow additional config options
}

export interface SendSlackStepInput {
  settings: SendSlackConfig
  context: any
  eventName?: string
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
    const { settings, context, eventName } = input

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
      const customSubject = settings.subject
      const resourceId = settings.resourceId || "unknown"
      const resourceType =
        settings.resourceType || "email.notification"
      const channel = settings.channel || "slack"
      const triggerType = settings.triggerType || "system"

      // Send notification
      const notificationResult =
        await notificationModuleService.createNotifications(
          {
            to: to,
            channel: channel,
            template: template,
            trigger_type: triggerType,
            resource_id: resourceId,
            resource_type: eventName,
            data: {
              ...context,
            },
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
