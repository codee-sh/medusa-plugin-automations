import { renderHTMLReact } from "../src/templates/emails/order-completed/template";
import { OrderCompletedTemplateDataType } from "../src/templates/emails/order-completed/types";
import { defaultTheme } from "../src/templates/shared/theme"

export const orderCompletedMockData: OrderCompletedTemplateDataType = {
  sales_channel: {
    name: "Test Sales Channel",
    description: "Test Sales Channel Description"
  },
  orderNumber: "1234567890",
  customerName: "Jan Kowalski",
  customerEmail: "jan@example.com",
  orderDate: "2021-01-01",
  completedDate: "2021-01-05",
  totalAmount: "100.00",
  currency: "PLN",
  items: [{
    title: "Test Product",
    quantity: 1,
    price: "100.00"
  }],
  shippingAddress: "Test Shipping Address",
  billingAddress: "Test Billing Address",
  orderUrl: "https://example.com/order/1234567890",
  summary: {
    total: "100.00",
    paid_total: "100.00",
    tax_total: "10.00",
    discount_total: "0.00",
    currency_code: "PLN"
  }
};

export default function OrderCompleted() {
  return renderHTMLReact(orderCompletedMockData, {
    locale: "pl",
    theme: defaultTheme
  });
}

