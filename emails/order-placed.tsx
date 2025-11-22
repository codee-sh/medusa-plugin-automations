import { renderHTMLReact } from "../src/templates/emails/order-placed/template";
import { OrderCreatedTemplateDataType } from "../src/templates/emails/order-placed/types";
import { defaultTheme } from "../src/templates/shared/theme"

export default function OrderPlaced() {
  const mockData: OrderCreatedTemplateDataType = {
    sales_channel: {
      name: "Test Sales Channel",
      description: "Test Sales Channel Description"
    },
    orderNumber: "1234567890",
    customerName: "Jan Kowalski",
    customerEmail: "jan@example.com",
    orderDate: "2021-01-01",
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

  return renderHTMLReact(mockData, {
    locale: "pl",
    theme: defaultTheme
  });
}