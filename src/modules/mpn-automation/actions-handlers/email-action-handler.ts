import {
  ActionHandler,
  ActionExecuteParams,
  ActionExecuteResult,
} from "../types";
import { FieldConfig } from "../types";
import { Modules } from "@medusajs/framework/utils";

export class EmailActionHandler implements ActionHandler {
  identifier = "EmailActionHandler";
  id = "email";
  label = "Email";
  description = "Send email notification";

  configComponentKey = "BaseConfigComponent";

  fields: FieldConfig[] = [
    {
      name: "to",
      key: "to",
      label: "To",
      type: "email" as const,
      required: true,
    },
    {
      name: "subject",
      key: "subject",
      label: "Subject",
      type: "text" as const,
      required: true,
    },
    {
      name: "body",
      key: "body",
      label: "Body",
      type: "textarea" as const,
      required: true,
    },
  ];

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
