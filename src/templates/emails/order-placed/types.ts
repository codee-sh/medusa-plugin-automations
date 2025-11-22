/**
 * Type definitions for order-created template data
 */

export interface OrderCreatedTranslationsType {
  headerTitle: string | ((data: any) => string);
  headerDescription: string;
  labels: {
    salesChannel: string;
    salesChannelDescription: string;
    orderNumber: string;
    orderDate: string;
    products: string;
    shippingAddress: string;
    orderTotal: string;
    taxTotal: string;
    discountTotal: string;
    paidTotal: string;
    currency: string;
    currencyCode: string;
    currencySymbol: string;
  };
  noData: string;
  viewOrderButton: string;
  footer: string;
}

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
