import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { runSlackActionWorkflow } from "../workflows/mpn-automation/run-slack-action"
import { getPluginOptions } from "../utils/plugins"

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
  const {
    action,
    context,
    eventName: triggerEventName,
    contextType,
  } = data
  const pluginOptions = getPluginOptions(container, "@codee-sh/medusa-plugin-notification-emails")
  const backendUrl = pluginOptions?.backend_url

  // const config = container.resolve("configModule") as any
  // const moduleConfig = config?.modules.mpnAutomation
  // const backendUrl = moduleConfig?.options.backend_url

  const contextData = {
    ...context,
    global: {
      backend_url: backendUrl,
    },
  }

  // Execute slack action workflow
  const { result } = await runSlackActionWorkflow(
    container
  ).run({
    input: {
      action: {
        ...action,
        config: {
          ...action.config,
          template: action.config.templateName
        },
      },
      context: contextData,
      contextType: contextType,
      eventName: triggerEventName,
    },
  })

  if (!result.success) {
    console.error(
      `Failed to send slack action ${action?.id}:`,
      result.error
    )
  }
}

export const config: SubscriberConfig = {
  event: eventName,
}
