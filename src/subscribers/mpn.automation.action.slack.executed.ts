import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { Modules } from "@medusajs/framework/utils"
import { sendSlackActionWorkflow } from "../workflows/mpn-automation/send-slack-action"

/**
 * Event name for the MPN automation action slack executed event.
 */
const eventName = "mpn.automation.action.slack.executed"

/**
 * Subscriber that runs the slack action workflow for the MPN automation system.
 *
 * This subscriber is triggered when an slack action is executed by the MPN automation system.
 * It runs the slack action workflow to send a slack notification.
 *
 * @param event - The event data containing the action and context.
 * @param container - The container instance.
 */
export default async function mpnAutomationActionSlackExecutedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const { action, context, eventName } = data

  console.log(eventName, data)

  // Execute email action workflow
  const { result } = await sendSlackActionWorkflow(
    container
  ).run({
    input: {
      action: {
        ...action,
        config: {
          ...action.config,
          template:
            action.config.templateName ?? "inventory-level",
        },
      },
      context: context,
      eventName: eventName,
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
