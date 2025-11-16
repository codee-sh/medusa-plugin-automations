/**
 * Type definitions for order-created template data
 */

export type OrderCreatedTemplateDataType = {
  sales_channel: {
    name: string;
    description: string;
  };
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  totalAmount: string;
  currency: string;
  items: Array<{
    title: string;
    quantity: number;
    price: string;
  }>;
  shippingAddress?: string;
  billingAddress?: string;
  orderUrl?: string;
  summary: {
    total: string;
    paid_total: string;
    tax_total: string;
    discount_total: string;
    currency_code: string;
  };
};
