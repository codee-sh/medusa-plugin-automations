import mjml2html from 'mjml'
import { Theme } from "../../shared/components";
import { escapeHtml } from "../../shared/utils";
import { getTranslations } from "../../shared/i18n";
import { translations, Locale } from "./locales";
import { getContactFormMain } from "./main";
import { ContactFormTemplateData } from "./types";

interface ContactFormOptions {
  theme?: Theme;
  locale?: Locale;
}

export function getContactFormHtml(
  data: ContactFormTemplateData, 
  options: ContactFormOptions = {}
): string {
  return mjml2html(`
    <mjml>
      <mj-head>
        <mj-title>${escapeHtml(data.subject)}</mj-title>
      </mj-head>
      <mj-body>
        ${getContactFormMain(data, options)}
      </mj-body>
    </mjml>
  `, {
    keepComments: false,
  }).html
}

export function getContactFormText(
  data: ContactFormTemplateData, 
  options: ContactFormOptions = {}
): string {
  const locale = options.locale || "pl";
  const t = getTranslations(translations, locale);

  return `
${data.subject}

${t.labels.name}: ${data.name}
${t.labels.email}: ${data.email}
${data.phone ? `${t.labels.phone}: ${data.phone}\n` : ""}
${t.labels.message}:
${data.message}

---
${t.footer}
  `.trim();
}
