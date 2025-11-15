import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { renderTemplate } from "../../../../templates/emails"

export async function POST(
  req: MedusaRequest<{ templateName: string, templateData: any, locale: string }>,
  res: MedusaResponse
) {
  const templateName = req.body?.templateName || "contact-form"
  const templateData = req.body?.templateData
  const locale = req.body?.locale || "pl"

  const { html, text } = renderTemplate(
    templateName as any,
    templateData,
    { locale: locale as any }
  )

  res.status(200).json({
    html,
    text,
  })
}

