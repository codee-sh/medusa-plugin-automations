import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight } from "@medusajs/icons"
import { useEffect, useState } from "react"
import { 
  Container,
  Heading,
  Button,
  Select,
  Text
} from "@medusajs/ui"
import { SingleColumnPage } from "../../../components/layout/pages"
import { OrderPlacedTemplate } from "../../../notifications-templates/order-placed"
import { useOrders } from "../../../../hooks/api/orders"

const PreviewTemplatePage = () => {
  const templateName = ""
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templateName)
  const [selectedOrder, setSelectedOrder] = useState<string>("")
  const templates = [
    { label: "Contact Form", value: "contact-form" },
    { label: "Order", value: "order" },
  ]

  const { data: orders, isLoading: isOrdersLoading } = useOrders({
    fields: "id,display_id",
    enabled: selectedTemplate === "order",
  });  

  useEffect(() => {
    if (orders) {
      console.log(orders);
    }
  }, [orders]);

  return (
    <SingleColumnPage
      widgets={{
        before: [],
        after: [],
      }}
    >
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading>Preview Template</Heading>
        </div>
        <div className="divide-y p-0">
          <div className="flex items-center justify-between px-6 py-4">
            <Text className="w-1/4">Choose template type:</Text>
            <Select
              value={selectedTemplate}
              onValueChange={(value) => setSelectedTemplate(value)}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select a template" />
              </Select.Trigger>
              <Select.Content>
                {templates.map((template) => (
                  <Select.Item key={template.value} value={template.value}>
                    {template.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          {selectedTemplate && <div className="divide-y p-0">
          <div className="flex items-center justify-between px-6 py-4">
            <Heading level="h2">Choose template type:</Heading>
          </div>
          {selectedTemplate === "order" && <div className="flex items-center justify-between px-6 py-4">
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
          </div>}
        </div>}
        {selectedTemplate === "order" && selectedOrder && <OrderPlacedTemplate orderId={selectedOrder} />}          
        </div>
      </Container>
    </SingleColumnPage>  
  )
}

export const config = defineRouteConfig({
  label: "Preview Template",
  icon: ChatBubbleLeftRight,
})

export default PreviewTemplatePage
