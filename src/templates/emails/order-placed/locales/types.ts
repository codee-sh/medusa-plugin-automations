/**
 * Type definitions for order-created translations
 */

export interface OrderCreatedTranslations {
  headerTitle: string;
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

