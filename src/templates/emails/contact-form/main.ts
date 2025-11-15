import {
  sectionHeader,
  sectionFooter,
  sectionText,
  sectionDivider,
  Theme,
} from "../../shared/components";
import { escapeHtml } from "../../shared/utils";
import { getTranslations } from "../../shared/i18n";
import { translations, Locale } from "./locales";
import { ContactFormTemplateData } from "./types";

interface ContactFormMainOptions {
  theme?: Theme;
  locale?: Locale;
}

export function getContactFormMain(
  data: ContactFormTemplateData,
  options: ContactFormMainOptions = {}
): string {
  const theme = options.theme;
  const locale = options.locale || "pl";
  const t = getTranslations(translations, locale);

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
