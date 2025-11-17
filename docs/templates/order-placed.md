# Order Placed Template

Email template sent when an order is placed. Includes order details, items, shipping information, and summary.

## Template Name

- Constant: `TEMPLATES_NAMES.ORDER_PLACED`
- String: `"order-placed"`

## Required Data

```typescript
{
  orderNumber: string
  customerEmail: string
  orderDate: string
  items: Array<{
    title: string
    quantity: number
    price: string
    thumbnail?: string
  }>
  sales_channel: {
    name: string
    description?: string
  }
  shippingAddress?: string
  billingAddress?: string
  summary: {
    total: string
    paid_total: string
    tax_total: string
    discount_total: string
    currency_code: string
  }
  orderUrl?: string
}
```

## Example Usage

### Basic Usage

```typescript
import { renderTemplate, TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification/templates/emails"

const { html, text } = renderTemplate(
  TEMPLATES_NAMES.ORDER_PLACED,
  {
    orderNumber: "#12345",
    customerEmail: "customer@example.com",
    orderDate: "2024-01-15 10:30:00",
    items: [
      {
        title: "Product Name",
        quantity: 2,
        price: "$50.00",
        thumbnail: "https://example.com/image.jpg"
      }
    ],
    sales_channel: {
      name: "Online Store"
    },
    shippingAddress: "123 Main St, City, Country",
    summary: {
      total: "$100.00",
      paid_total: "$100.00",
      tax_total: "$10.00",
      discount_total: "$0.00",
      currency_code: "USD"
    }
  },
  {
    locale: "pl",
    theme: "default"
  }
)
```

### With Custom Translations

```typescript
const { html, text } = renderTemplate(
  TEMPLATES_NAMES.ORDER_PLACED,
  templateData,
  {
    locale: "pl",
    customTranslations: {
      pl: {
        headerTitle: ({ data }) => `Twoje zamówienie #${data.orderNumber}`,
        labels: {
          orderNumber: "Numer zamówienia"
        }
      }
    }
  }
)
```

### With Notification Module

```typescript
import { renderTemplate, TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification/templates/emails"
import { Modules } from "@medusajs/framework/utils"

const notificationModuleService = container.resolve(Modules.NOTIFICATION)

const { html, text } = renderTemplate(
  TEMPLATES_NAMES.ORDER_PLACED,
  templateData,
  { locale: "pl" }
)

await notificationModuleService.createNotifications({
  to: "customer@example.com",
  channel: "email",
  content: {
    subject: "Order Confirmation",
    html,
    text
  }
})
```

## Template Fields

The template displays the following information:

- Order number and date
- Sales channel information
- Order items with thumbnails, titles, quantities, and prices
- Shipping and billing addresses
- Order summary (totals, taxes, discounts)
- Optional order URL button
- Footer with contact information

## Translations

See [Translations Documentation](../translations.md) for available translation keys and how to customize them.

