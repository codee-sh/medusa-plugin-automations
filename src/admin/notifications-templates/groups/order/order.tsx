import { useState } from "react";
import { Select, Text } from "@medusajs/ui";
import { useOrders } from "../../../../hooks/api/orders";
import { OrderPlacedTemplate } from "./order-placed";

export const OrderTemplateGroup = () => {
  const [selectedOrder, setSelectedOrder] = useState<string>("");

  const { data: orders, isLoading: isOrdersLoading } = useOrders({
    fields: "id,display_id",
    enabled: true,
  });

  return (
    <>
      <div className="flex items-center justify-between px-6 py-4">
        <Text className="w-1/4">Select order:</Text>
        <Select
          value={selectedOrder}
          onValueChange={(value) => setSelectedOrder(value)}
          disabled={isOrdersLoading}
        >
          <Select.Trigger>
            <Select.Value placeholder="Select an order" />
          </Select.Trigger>
          <Select.Content>
            {orders?.orders?.map((order: any) => (
              <Select.Item key={order.id} value={order.id}>
                #{order.display_id}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>
      {selectedOrder && <OrderPlacedTemplate orderId={selectedOrder} />}
    </>
  );
};

