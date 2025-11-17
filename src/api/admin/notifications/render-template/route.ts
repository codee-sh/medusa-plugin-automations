import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { renderTemplate } from "../../../../templates/emails"
import { getPluginOptions } from "../../../../utils/plugins"

export async function POST(
  req: MedusaRequest<{ templateName: string, templateData: any, locale: string }>,
  res: MedusaResponse
) {
  const pluginOptions = getPluginOptions(req.scope, "@codee-sh/medusa-plugin-notification")

  const templateName = req.body?.templateName || "contact-form"
  const templateData = req.body?.templateData
  const locale = req.body?.locale || "pl"

  const { html, text } = renderTemplate(
    templateName as any,
    templateData,
    { locale: locale as any, customTranslations: pluginOptions?.customTranslations?.[templateName] }
  )

  res.status(200).json({
    html,
    text,
  })
}

