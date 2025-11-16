import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import type { MedusaContainer } from "@medusajs/framework/types"

export function getPluginOptions(container: MedusaContainer, pluginName: string): Record<string, any> | undefined {
  try {
    const configModule = container.resolve(ContainerRegistrationKeys.CONFIG_MODULE)
    const plugin = configModule.plugins?.find((p) => {
      if (typeof p === "string") {
        return p === pluginName
      }
      return p.resolve === pluginName
    })
    return typeof plugin === "object" ? plugin.options : undefined
  } catch (error) {
    throw error
  }
}