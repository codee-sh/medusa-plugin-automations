import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { renderTemplate } from "../../../../templates/emails"
import { getPluginOptions } from "../../../../utils/plugins"
import { defaultTheme } from "../../../../templates/shared/theme"
import { TemplateName } from "../../../../templates/emails"

export async function POST(
  req: MedusaRequest<{ templateName: string, templateData: any, locale: string }>,
  res: MedusaResponse
) {
  const pluginOptions = getPluginOptions(req.scope, "@codee-sh/medusa-plugin-notification")

  const templateName = req.body?.templateName as TemplateName
  const templateData = req.body?.templateData as any
  const locale = req.body?.locale || "pl"

  if (!templateName || !templateData || !locale) {
    throw new MedusaError(MedusaError.Types.INVALID_ARGUMENT, "Template name, template data and locale are required")
  }

  const { html, text } = await renderTemplate(
    templateName,
    templateData,
    { 
      locale: locale,
      theme: pluginOptions?.theme || defaultTheme,
      customTranslations: pluginOptions?.customTranslations?.[templateName]
    }
  )

  res.status(200).json({
    html,
    text,
  })
}

