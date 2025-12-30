import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import { ConfigModule } from "@medusajs/framework/config"
import {
  Logger,
  NotificationTypes,
} from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"

type SlackPluginOptions = {
  webhook_url: string
  admin_url: string
}

export type InjectedDependencies = {
  configModule: ConfigModule
}

export class SlackNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "mpn-slack"
  protected logger_: Logger
  services_types: any
  protected options_: SlackPluginOptions

  constructor(
    { configModule }: InjectedDependencies,
    options: SlackPluginOptions
  ) {
    super()

    this.options_ = options
  }

  static validateOptions(
    options: Record<any, any>
  ): void | never {
    if (!options.webhook_url) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Webhook URL is required"
      )
    }
    if (!options.admin_url) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Admin URL is required"
      )
    }
  }

  private async getDisplayAmount(
    amount: number,
    currencyCode: string
  ) {
    return Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount)
  }

  async send(
    notification: NotificationTypes.ProviderSendNotificationDTO & {
      content: any
    }
  ): Promise<any> {
    const { template, data, content } = notification as {
      template: string
      data: any
      content: {
        text: string
        blocks: any
      }
    }

    try {
      const response = await fetch(
        this.options_.webhook_url,
        {
          method: "POST",
          body: JSON.stringify({
            text: content.text,
            blocks: content.blocks,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      // Slack webhook API returns "ok" as plain text, not JSON
      const responseText = await response.text()

      if (responseText !== "ok") {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `Failed to send notification to Slack: ${responseText}`
        )
      }

      return {
        status: responseText === "ok" ? "success" : "failed",
      }
    } catch (error) {
      console.error("Failed to send notification to Slack", error)

      return {
        status: "failed"
      }
    }
  }
}
