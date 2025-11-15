import { useEffect, useState } from "react";
import { useOrder } from "../../hooks/api/orders";
import { usePreview } from "../../hooks/api/preview";
import { getFormattedAddress, formatDate, getLocaleAmount, getTotalCaptured, getStylizedAmount } from "../../utils";

export const OrderPlacedTemplate = () => {
  const [templateData, setTemplateData] = useState<any>(null);
  const { data: order, isLoading: isOrderLoading } = useOrder({
    // order_id: "order_01K90KMYFE30CN70BPRP15597H",
    order_id: "order_01K7RSJCYQQBRB5D2PQ6293Z3N",
    enabled: true,
  });

  useEffect(() => {
    if (order) {
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

      console.log(order);
      console.log(templateData);
    }
  }, [order]);

  const { data: preview, isLoading: isPreviewLoading } = usePreview({
    templateName: "order-placed",
    templateData: templateData,
    locale: "pl",
    enabled: !!templateData,
  });

  useEffect(() => {
    if (preview) {
      console.log(preview);
    }
  }, [preview]);

  return (
    <div className="px-6 py-4">
        <iframe
        srcDoc={preview?.html || ""}
        style={{ width: '100%', border: 'none', minHeight: '600px' }}
        sandbox="allow-same-origin"
        />
    </div>
  );
};
