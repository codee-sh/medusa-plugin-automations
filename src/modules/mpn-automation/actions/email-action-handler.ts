import {
  ActionHandler,
  ActionExecuteParams,
  ActionExecuteResult,
} from "../types/action-handler";
import { FieldConfig } from "../types";

export class EmailActionHandler implements ActionHandler {
  identifier = "EmailActionHandler";
  id = "email";
  label = "Email";
  description = "Send email notification";

  configComponentPath = "BaseConfigComponent";

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

  validateConfig(config: Record<string, any>): boolean | string {
    for (const field of this.fields) {
      if (field.required && !config[field.key]) {
        return `${field.label} is required`;
      }
    }
    
    return true;
  }

  async execute(params: ActionExecuteParams): Promise<ActionExecuteResult> {
    const { config, context } = params;

    try {
      // TODO: Implement actual email sending logic
      // This could use Medusa's notification service or external email provider
      console.log("Executing email action:", {
        to: config.to,
        subject: config.subject,
        body: config.body,
        context: context.trigger.name,
      });

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 100));

      return {
        success: true,
        message: "Email sent successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to send email",
      };
    }
  }
}
