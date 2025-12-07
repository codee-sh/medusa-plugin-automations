import { ActionHandler } from "../types";
import { FieldConfig } from "../types";
import { Modules } from "@medusajs/framework/utils";

export class BaseActionHandler implements ActionHandler {
  id = "base";
  label = "Base";
  description = "";

  configComponentKey = "BaseConfigComponent";

  fields: FieldConfig[] = [];

  async executeAction({
    action,
    context,
    result,
    container,
    eventName,
    triggerId,
  }: {
    action: Record<string, any>;
    context: any;
    result: any;
    container: any;
    eventName: string;
    triggerId: string;
  }) {
    const eventBusService = container.resolve(Modules.EVENT_BUS);

    await eventBusService.emit({
      name: eventName,
      data: {
        eventName: eventName,
        action: action,
        triggerId: triggerId,
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
