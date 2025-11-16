import mjml2html from 'mjml'
import { escapeHtml } from "../../shared/utils";
import { getTranslations } from "../../shared/i18n";
import { translations, Locale } from "./locales";
import { TemplateOptionsType } from "../types";
import { ContactFormTemplateDataType } from "./types";
import {
  sectionHeader,
  sectionFooter,
  sectionText,
  sectionDivider,
} from "../../shared/components";

export function getContactFormHtml(
  data: ContactFormTemplateDataType, 
  options: TemplateOptionsType
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

function getContactFormMain(
  data: ContactFormTemplateDataType,
  options: TemplateOptionsType
): string {
  const theme = options.theme;
  const locale = options.locale || "pl";
  const t = getTranslations(locale, translations, options.customTranslations);

  return `
    ${sectionHeader(data.subject, { theme })}

    ${sectionText(t.labels.name, escapeHtml(data.name), { theme })}

    ${sectionDivider({ theme })}

    ${sectionText(t.labels.email, escapeHtml(data.email), { theme })}  

    ${sectionDivider({ theme })}

    ${sectionText(t.labels.phone, escapeHtml(data.phone || ""), { theme })}

    ${sectionDivider({ theme })}

    ${sectionText(t.labels.message, escapeHtml(data.message), { theme })}
    
    ${sectionDivider({ theme })}

    ${sectionFooter(t.footer, { theme })}
  `.trim();
}

export function getContactFormText(
  data: ContactFormTemplateDataType, 
  options: TemplateOptionsType
): string {
  const locale = options.locale || "pl";
  const t = getTranslations(locale, translations, options.customTranslations);

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
