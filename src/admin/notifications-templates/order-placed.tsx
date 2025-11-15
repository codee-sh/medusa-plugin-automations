import { useEffect, useState } from "react";
import { useOrder, useOrders } from "../../hooks/api/orders";
import { usePreview } from "../../hooks/api/preview";
import { getFormattedAddress, formatDate, getLocaleAmount, getTotalCaptured, getStylizedAmount } from "../../utils";

export const OrderPlacedTemplate = ({ orderId }: { orderId: string }) => {
  const [templateData, setTemplateData] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any>(null);

  const { data: order, isLoading: isOrderLoading } = useOrder({
    order_id: orderId,
    enabled: !!orderId
  });

  useEffect(() => {
    if (order?.display_id) {
      const shippingAddressText = getFormattedAddress({ address: order.shipping_address }).join("<br/>");
      const billingAddressText = getFormattedAddress({ address: order.billing_address }).join("<br/>");
      const templateData = {
        subject: `#${order.display_id} - Order Placed`,
        orderNumber: `#${order.display_id}`,
        customerName: order.email,
        customerEmail: order.email,
        orderDate: formatDate({ date: order.created_at, includeTime: true, localeCode: "pl" }),
        totalAmount: order.items.reduce((acc, item) => acc + (item.variant?.prices?.[0]?.amount || 0) * item.quantity, 0),
        currency: order.currency_code,
        items: order.items.map((item) => ({
          thumbnail: item.thumbnail,
          title: item.title,
          quantity: item.quantity,
          price: getLocaleAmount(item.unit_price, order.currency_code),
        })),
        shippingAddress: shippingAddressText,
        billingAddress: billingAddressText,
        summary: {
          total: getLocaleAmount(order.summary.original_order_total, order.currency_code),
          paid_total: getLocaleAmount(getTotalCaptured(order.payment_collections || []), order.currency_code),
          tax_total: getLocaleAmount(order.tax_total, order.currency_code),
          discount_total: getLocaleAmount(order.discount_total, order.currency_code),
          currency: order.currency_code,
        }
      };

      setTemplateData(templateData);
    }
  }, [order]);

  const { data: preview, isLoading: isPreviewLoading } = usePreview({
    templateName: "order-placed",
    templateData: templateData,
    locale: "pl",
    enabled: !!templateData,
    extraKey: [templateData, orderId]
  });

  useEffect(() => {
    if (isOrderLoading) {
      console.log("Loading order", orderId);
      setPreviewData(null);
    }
  }, [isOrderLoading]);

  useEffect(() => {
    if (preview) {
      console.log("Loading preview", preview);
      setPreviewData(preview);
    }
  }, [preview]);

  return (
    <div>
      {isOrderLoading && <div>Loading preview for order {orderId}...</div>}
      {previewData && <div className="px-6 py-4">
          <iframe
            srcDoc={previewData?.html || ""}
            style={{ width: '100%', border: 'none', minHeight: '600px' }}
            sandbox="allow-same-origin"
          />
      </div>}
    </div>
  );
};
