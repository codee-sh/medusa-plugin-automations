import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils";
import { ConfigModule } from "@medusajs/framework/config";
import { Logger, NotificationTypes } from "@medusajs/framework/types";
import { MedusaError } from "@medusajs/framework/utils";

type SlackPluginOptions = {
  webhook_url: string;
  admin_url: string;
};

export type InjectedDependencies = {
  configModule: ConfigModule;
};

export class SlackNotificationProviderService extends AbstractFulfillmentProviderService {
  static identifier = "mpn-slack";
  protected logger_: Logger;
  services_types: any;
  protected options_: SlackPluginOptions;

  constructor(
    { configModule }: InjectedDependencies,
    options: SlackPluginOptions
  ) {
    super();

    this.options_ = options;
  }

  static validateOptions(options: Record<any, any>): void | never {
    if (!options.webhook_url) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Webhook URL is required"
      );
    }
    if (!options.admin_url) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Admin URL is required"
      );
    }
  }

  private async getDisplayAmount(amount: number, currencyCode: string) {
    return Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  }

  private getNotificationText(template: string, data: any) {
    switch (template) {
      case "inventory-level":
        return `New inventory ${data?.inventory_level?.id as string || 'unknown'} level was updated`;
      default:
        return `Unknown notification`;
    }
  }

  private getNotificationBlocks(template: string, data: any) {
    switch (template) {
      case "inventory-level":
        return [
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": `New inventory ${data?.inventory_level?.id as string || 'unknown'} level was updated`,
              "emoji": true
            }
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Otwórz w panelu"
                },
                url: `${this.options_.admin_url}/inventory/${data?.inventory_level?.inventory_item_id as string}`,
                style: "primary"
              }
            ]
          },
          {
            type: "divider"
          }
        ]
      default:
        return [];
    }
  }

  async send(
    notification: NotificationTypes.ProviderSendNotificationDTO
  ): Promise<any> {
    const { template, data } = notification as { template: string, data: any };

    console.log("notification", notification);

    const response = await fetch(this.options_.webhook_url, {
      method: "POST",
      body: JSON.stringify({
        text: this.getNotificationText(template, data),
        blocks: this.getNotificationBlocks(template, data),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Failed to send notification to Slack"
      );
    }

    return {
      status: response.ok ? "success" : "error",
    }

    // switch (template) {
    //   case "inventory-level":
    //     // return this.sendOrderNotification(notification);
    //   default:
    //     throw new MedusaError(
    //       MedusaError.Types.NOT_FOUND,
    //       `Template ${template} not supported`
    //     );
    // }
  }
}
