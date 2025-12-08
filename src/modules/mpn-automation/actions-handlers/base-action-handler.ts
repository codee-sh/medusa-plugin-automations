import { ActionHandler } from "../types";
import { FieldConfig } from "../types";
import { Modules } from "@medusajs/framework/utils";
import { NotificationTrigger } from "../types";

export class BaseActionHandler implements ActionHandler {
  id = "base";
  label = "Base";
  description = "";

  configComponentKey = "BaseConfigComponent";

  fields: FieldConfig[] = [];

  async executeAction({
    trigger,
    action,
    context,
    container,
    eventName,
  }: {
    trigger: any;
    action: Record<string, any>;
    context: any;
    container: any;
    eventName: string;
  }) {
    const eventBusService = container.resolve(Modules.EVENT_BUS);

    await eventBusService.emit({
      name: eventName,
      data: {
        eventName: eventName,
        action: action,
        trigger: trigger.id,
        context: context,
      },
    });

    return {
      actionId: action.id,
      actionType: action.action_type,
      success: true,
    };
  }
}
