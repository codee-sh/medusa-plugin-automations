import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { sendEmailActionWorkflow } from "../workflows/mpn-automation/send-email-action"

/**
 * Event name for the MPN automation action email executed event.
 */
const eventName = "mpn.automation.action.email.executed"

/**
 * Subscriber that runs the email action workflow for the MPN automation system.
 *
 * This subscriber is triggered when an email action is executed by the MPN automation system.
 * It runs the email action workflow to send an email notification.
 *
 * @param event - The event data containing the action and context.
 * @param container - The container instance.
 */
export default async function mpnAutomationActionEmailExecutedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const { action, context, eventName: triggerEventName, contextType } = data

  console.log(eventName, data)

  const { result } = await sendEmailActionWorkflow(
    container
  ).run({
    input: {
      action: {
        ...action,
        config: {
          ...action.config,
          to: action?.config?.to,
          subject: action?.config?.subject,
          locale: action?.config?.locale ?? "pl",
          templateName:
            action?.config?.templateName ??
            "inventory-level",
        },
      },
      context: context,
      eventName: triggerEventName,
      contextType: contextType,
    },
  })

  if (!result.success) {
    console.error(
      `Failed to send email action ${action?.id}:`,
      result.error
    )
  }
}

export const config: SubscriberConfig = {
  event: eventName,
}
