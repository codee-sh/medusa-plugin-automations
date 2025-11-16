import {
  sectionHeader,
  sectionFooter,
  sectionText,
  sectionDivider,
  buttonSection,
  richTextSection,
  sectionWrapper,
  Theme,
} from "../../shared/components";
import { getTranslations } from "../../shared/i18n";
import { translations, Locale } from "./locales";
import { OrderCreatedTemplateData } from "./types";
import { escapeHtml } from "../../shared/utils";

interface OrderCreatedMainOptions {
  theme?: Theme;
  locale?: Locale;
}

export function getOrderCreatedMain(
  data: OrderCreatedTemplateData,
  options: OrderCreatedMainOptions = {}
): string {
  const theme = options.theme;
  const locale = options.locale || "pl";
  const t = getTranslations(translations, locale);

  const itemsList = data.items
    .map(
      (item) =>
        `${escapeHtml(item.title)} - ${item.quantity}x ${escapeHtml(
          item.price
        )}`
    )
    .join("<br/>");

  return `
    ${sectionHeader(t.headerTitle.replace("{{orderNumber}}", escapeHtml(data.orderNumber)), { theme })}

    ${richTextSection(t.headerDescription, { theme, align: "center" })}

    ${sectionDivider({ theme })}

    ${sectionText(t.labels.salesChannel, escapeHtml(data.sales_channel.name), {
      theme,
      twoColumn: true,
    })}

    ${sectionDivider({ theme })}

    ${sectionText(t.labels.orderNumber, escapeHtml(data.orderNumber), {
      theme,
      twoColumn: true,
    })}

    ${sectionDivider({ theme })}

    ${sectionText(t.labels.orderDate, escapeHtml(data.orderDate), { theme, twoColumn: true })}

    ${sectionDivider({ theme })}

    ${sectionText(t.labels.products, itemsList, { theme })}

    ${sectionDivider({ theme })}

    ${sectionText(t.labels.shippingAddress, data?.shippingAddress || t.noData, {
      theme,
    })}

    ${sectionDivider({ theme })}

    ${sectionWrapper(
      `
        ${sectionText(
          t.labels.discountTotal,
          escapeHtml(data.summary.discount_total),
          { theme, twoColumn: true }
        )}
        ${sectionText(
          t.labels.orderTotal,
          `${escapeHtml(data.summary.total)} ${escapeHtml(
            data.summary.currency_code
          )}`,
          { theme, twoColumn: true }
        )}
        ${sectionText(
          t.labels.paidTotal,
          `${escapeHtml(data.summary.paid_total)} ${escapeHtml(
            data.summary.currency_code
          )}`,
          { theme, twoColumn: true }
        )}
        ${sectionText(t.labels.taxTotal, escapeHtml(data.summary.tax_total), {
          theme,
          twoColumn: true
        })}
      `,
      { theme, hasBackground: true }
    )}

    ${sectionDivider({ theme })}

    ${data.orderUrl ? sectionDivider({ theme }) : ""}

    ${
      data.orderUrl
        ? buttonSection(t.viewOrderButton, data.orderUrl, {
            theme,
          })
        : ""
    }

    ${sectionFooter(t.footer, { theme })}
  `.trim();
}
