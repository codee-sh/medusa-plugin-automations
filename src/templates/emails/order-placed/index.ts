import { escapeHtml } from "../../shared/utils";
import { getTranslations } from "../../shared/i18n";
import { translations, Locale } from "./locales";
import { OrderCreatedTemplateDataType } from "./types";
import { TemplateOptionsType } from "../types";
import { renderLabel } from "../../shared/utils";
import { renderHTML, renderText } from "./template";

/**
 * Generates HTML email for order created notificat
 * 
 * @param data - Order data (includes subject)
 * @param options - Optional theme and locale configuration
 * @returns HTML string ready to send
 */
export async function getOrderCreatedHtml(
  data: OrderCreatedTemplateDataType,
  options: TemplateOptionsType
): Promise<any> {
  return await renderHTML(data, options);
}

export async function getOrderCreatedText(
  data: OrderCreatedTemplateDataType,
  options: TemplateOptionsType
): Promise<any> {
  return await renderText(data, options);
}

// export function getOrderCreatedMain(
//   data: OrderCreatedTemplateDataType,
//   options: TemplateOptionsType
// ): string {
//   const theme = options.theme;
//   const locale = options.locale || "pl";
//   const t = getTranslations(locale, translations, options.customTranslations);

//   const itemsList = data.items
//     .map(
//       (item) =>
//         `${escapeHtml(item.title)} - ${item.quantity}x ${escapeHtml(
//           item.price
//         )}`
//     )
//     .join("<br/>");

//   return `
//     ${sectionHeader(renderLabel(t.headerTitle, data), { theme })}

//     ${richTextSection(renderLabel(t.headerDescription, data), { theme, align: "center" })}

//     ${sectionDivider({ theme })}

//     ${sectionText(renderLabel(t.labels.salesChannel, data), escapeHtml(data.sales_channel.name), {
//       theme,
//       twoColumn: true,
//     })}

//     ${sectionDivider({ theme })}

//     ${sectionText(renderLabel(t.labels.orderNumber, data), escapeHtml(data.orderNumber), {
//       theme,
//       twoColumn: true,
//     })}

//     ${sectionDivider({ theme })}

//     ${sectionText(renderLabel(t.labels.orderDate, data), escapeHtml(data.orderDate), { theme, twoColumn: true })}

//     ${sectionDivider({ theme })}

//     ${sectionText(renderLabel(t.labels.products, data), itemsList, { theme })}

//     ${sectionDivider({ theme })}

//     ${sectionText(renderLabel(t.labels.shippingAddress, data), data?.shippingAddress || t.noData, {
//       theme,
//     })}

//     ${sectionDivider({ theme })}

//     ${sectionWrapper(
//       `
//         ${sectionText(
//           renderLabel(t.labels.discountTotal, data),
//           escapeHtml(data.summary.discount_total),
//           { theme, twoColumn: true }
//         )}
//         ${sectionText(
//           renderLabel(t.labels.orderTotal, data),
//           `${escapeHtml(data.summary.total)} ${escapeHtml(
//             data.summary.currency_code
//           )}`,
//           { theme, twoColumn: true }
//         )}
//         ${sectionText(
//           renderLabel(t.labels.paidTotal, data),
//           `${escapeHtml(data.summary.paid_total)} ${escapeHtml(
//             data.summary.currency_code
//           )}`,
//           { theme, twoColumn: true }
//         )}
//         ${sectionText(renderLabel(t.labels.taxTotal, data), escapeHtml(data.summary.tax_total), {
//           theme,
//           twoColumn: true
//         })}
//       `,
//       { theme, hasBackground: true }
//     )}

//     ${sectionDivider({ theme })}

//     ${data.orderUrl ? sectionDivider({ theme }) : ""}

//     ${
//       data.orderUrl
//         ? buttonSection(renderLabel(t.viewOrderButton, data), data.orderUrl, {
//             theme,
//           })
//         : ""
//     }

//     ${sectionFooter(renderLabel(t.footer, data), { theme })}
//   `.trim();
// }

// /**
//  * Generates plain text email for order created notification
//  * 
//  * @param data - Order data (includes subject)
//  * @param options - Optional theme and locale configuration
//  * @returns Plain text string ready to send
//  */
// export function getOrderCreatedText(
//   data: OrderCreatedTemplateDataType,
//   options: TemplateOptionsType
// ): string {
//   const locale = options.locale || "pl";
//   const t = getTranslations(locale, translations, options.customTranslations);

//   const itemsList = data.items
//     .map(
//       (item) =>
//         `  - ${item.title} - ${item.quantity}x ${item.price}`
//     )
//     .join("\n");

//   const shippingAddressText = data.shippingAddress
//     ? data.shippingAddress.replace(/<br\s*\/?>/gi, "\n")
//     : t.noData;

//   return `
// ${renderLabel(t.headerTitle, data)}

// ${t.headerDescription}

// ${renderLabel(t.labels.orderNumber, data)}: ${data.orderNumber}
// ${renderLabel(t.labels.orderDate, data)}: ${data.orderDate}

// ${renderLabel(t.labels.products, data)}:
// ${itemsList}

// ${renderLabel(t.labels.shippingAddress, data)}:
// ${shippingAddressText}

// ${renderLabel(t.labels.orderTotal, data)}: ${data.totalAmount} ${data.currency}

// ${data.orderUrl ? `${renderLabel(t.viewOrderButton, data)}: ${data.orderUrl}` : ""}

// ---
// ${renderLabel(t.footer, data)}
//   `.trim();
// }

