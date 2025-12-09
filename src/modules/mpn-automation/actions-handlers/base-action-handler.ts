import { ActionHandler } from "../types"
import { FieldConfig } from "../types"
import { Modules } from "@medusajs/framework/utils"

export class BaseActionHandler implements ActionHandler {
  id = "base"
  label = "Base"
  description = ""

  configComponentKey = "BaseConfigComponent"

  // Fields for the action configuration rendered in the admin panel then saved in the action config
  fields: FieldConfig[] = []

  // Function that executes the action in the workflow actions
  async executeAction({
    trigger,
    action,
    context,
    container,
    eventName,
  }: {
    trigger: any
    action: Record<string, any>
    context: any
    container: any
    eventName: string
  }) {
    const eventBusService = container.resolve(
      Modules.EVENT_BUS
    )

    await eventBusService.emit({
      name: eventName,
      data: {
        eventName: eventName,
        action: action,
        trigger: trigger.id,
        context: context,
      },
    })

    return {
      actionId: action.id,
      actionType: action.action_type,
      success: true,
    }
  }
}
