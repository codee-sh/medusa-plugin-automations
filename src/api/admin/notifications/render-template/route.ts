import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { renderTemplate } from "../../../../templates/emails"
import { getPluginOptions } from "../../../../utils/plugins"
import { defaultTheme } from "../../../../templates/shared/theme"

export async function POST(
  req: MedusaRequest<{ templateName: string, templateData: any, locale: string }>,
  res: MedusaResponse
) {
  const pluginOptions = getPluginOptions(req.scope, "@codee-sh/medusa-plugin-notification")

  const templateName = req.body?.templateName
  const templateData = req.body?.templateData
  const locale = req.body?.locale || "pl"

  if (!templateName || !templateData || !locale) {
    throw new MedusaError(MedusaError.Types.INVALID_ARGUMENT, "Template name, template data and locale are required")
  }

  const { html, text } = await renderTemplate(
    templateName as any,
    templateData,
    { 
      locale: locale as any,
      theme: pluginOptions?.theme || defaultTheme,
      customTranslations: pluginOptions?.customTranslations?.[templateName]
    }
  )

  res.status(200).json({
    html,
    text,
  })
}

