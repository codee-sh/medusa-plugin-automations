import { createWorkflow, WorkflowData, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { getNotificationTriggersByEventStep } from "./steps/get-notification-triggers-by-event"

export interface GetNotificationTriggersByEventWorkflowInput {
  event_name: string
}

export const getNotificationTriggersByEventWorkflowId = "get-notification-triggers-by-event"

/**
 * This workflow retrieves notification triggers (scenarios) by event name.
 * 
 * @example
 * const { result } = await getNotificationTriggersByEventWorkflow(container).run({
 *   input: {
 *     event_name: "inventory.inventory-level.updated"
 *   }
 * })
 */
export const getNotificationTriggersByEventWorkflow = createWorkflow(
  getNotificationTriggersByEventWorkflowId,
  (input: WorkflowData<GetNotificationTriggersByEventWorkflowInput>) => {
    const triggers = getNotificationTriggersByEventStep({
      event_name: input.event_name,
    })

    return new WorkflowResponse(triggers)
  }
)

