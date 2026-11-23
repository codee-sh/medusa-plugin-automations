import { Modules } from "@medusajs/framework/utils"
import { FieldConfig } from "../types"
import { BaseActionService } from "./base-action-service"

function resolveRecipient(
  rawTo: unknown,
  context: Record<string, any>
): string {
  if (typeof rawTo !== "string" || !rawTo.trim()) {
    return String(
      context?.email ||
        context?.customer?.email ||
        context?.order?.email ||
        context?.phone ||
        context?.customer?.phone ||
        ""
    ).trim()
  }

  const trimmed = rawTo.trim()
  const pathMatch = /^\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}$/.exec(
    trimmed
  )
  const path = pathMatch ? pathMatch[1] : null
  if (!path) {
    return trimmed
  }

  let current: any = context
  for (const segment of path.split(".")) {
    if (
      segment === "__proto__" ||
      segment === "constructor" ||
      segment === "prototype"
    ) {
      return ""
    }
    if (current == null || typeof current !== "object") {
      return ""
    }
    current = current[segment]
  }
  return current != null ? String(current).trim() : ""
}

export class NotificationActionService extends BaseActionService {
  id = "notification"
  label = "Medusa Notification"
  description =
    "Dispatch notifications through Medusa Modules.NOTIFICATION (Email, SMS, WhatsApp, Telegram, Slack)"
  enabled = true

  fields: FieldConfig[] = [
    {
      name: "channel",
      key: "channel",
      label: "Channel",
      type: "select" as const,
      required: true,
      defaultValue: "email",
      options: [
        { value: "email", name: "Email" },
        { value: "sms", name: "SMS" },
        { value: "whatsapp", name: "WhatsApp" },
        { value: "telegram", name: "Telegram" },
        { value: "slack", name: "Slack" },
      ],
    },
    {
      name: "to",
      key: "to",
      label: "Recipient (address, phone, or {{customer.email}})",
      type: "text" as const,
      required: false,
    },
    {
      name: "template",
      key: "template",
      label: "Template ID / Name",
      type: "text" as const,
      required: true,
    },
    {
      name: "subject",
      key: "subject",
      label: "Subject (optional)",
      type: "text" as const,
      required: false,
    },
  ]

  async executeAction({
    action,
    context,
    container,
    eventName,
    contextType,
  }: {
    trigger: any
    action: Record<string, any>
    context: any
    container: any
    eventName: string
    contextType?: string | null
  }) {
    const config = action?.config || action || {}
    const channel = String(config.channel || "email").trim()
    const template = String(
      config.template || config.templateName || ""
    ).trim()
    const to = resolveRecipient(config.to, context || {})

    if (!template) {
      return {
        success: false,
        message: "Notification template is required",
      }
    }
    if (!to) {
      return {
        success: false,
        message: "Notification recipient could not be resolved",
      }
    }

    const notificationService = container.resolve(
      Modules.NOTIFICATION
    )
    const result =
      await notificationService.createNotifications({
        to,
        channel,
        template,
        data: {
          ...(context || {}),
          event_name: eventName,
          context_type: contextType,
          ...(config.subject
            ? { subject: String(config.subject) }
            : {}),
        },
      })

    return {
      success: true,
      message: `Notification dispatched via ${channel}`,
      data: result,
    }
  }
}
