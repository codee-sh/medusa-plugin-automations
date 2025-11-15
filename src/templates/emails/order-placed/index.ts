import mjml2html from "mjml";
import { Theme } from "../../shared/components";
import { escapeHtml } from "../../shared/utils";
import { getTranslations } from "../../shared/i18n";
import { translations, Locale } from "./locales";
import { getOrderCreatedMain } from "./main";
import { OrderCreatedTemplateData } from "./types";

interface OrderCreatedOptions {
  theme?: Theme;
  locale?: Locale;
}

/**
 * Generates HTML email for order created notification
 * 
 * @param data - Order data (includes subject)
 * @param options - Optional theme and locale configuration
 * @returns HTML string ready to send
 */
export function getOrderCreatedHtml(
  data: OrderCreatedTemplateData,
  options: OrderCreatedOptions = {}
): string {
  return mjml2html(
    `
    <mjml>
      <mj-head>
        <mj-title>${escapeHtml(data.subject)}</mj-title>
      </mj-head>
      <mj-body>
        ${getOrderCreatedMain(data, options)}
      </mj-body>
    </mjml>
  `,
    {
      keepComments: false,
    }
  ).html;
}

/**
 * Generates plain text email for order created notification
 * 
 * @param data - Order data (includes subject)
 * @param options - Optional theme and locale configuration
 * @returns Plain text string ready to send
 */
export function getOrderCreatedText(
  data: OrderCreatedTemplateData,
  options: OrderCreatedOptions = {}
): string {
  const locale = options.locale || "pl";
  const t = getTranslations(translations, locale);

  const itemsList = data.items
    .map(
      (item) =>
        `  - ${item.title} - ${item.quantity}x ${item.price}`
    )
    .join("\n");

  const shippingAddressText = data.shippingAddress
    ? data.shippingAddress.replace(/<br\s*\/?>/gi, "\n")
    : t.noData;

  return `
${data.subject}

${t.thankYouMessage}

${t.labels.orderNumber}: ${data.orderNumber}
${t.labels.orderDate}: ${data.orderDate}

${t.labels.products}:
${itemsList}

${t.labels.shippingAddress}:
${shippingAddressText}

${t.labels.orderTotal}: ${data.totalAmount} ${data.currency}

${data.orderUrl ? `${t.viewOrderButton}: ${data.orderUrl}` : ""}

---
${t.footer}
  `.trim();
}

