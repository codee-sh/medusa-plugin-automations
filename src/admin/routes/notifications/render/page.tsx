import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight } from "@medusajs/icons"
import { useParams } from "react-router-dom"
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

const PreviewTemplatePage = () => {
  const templateName = "order-placed"
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templateName)
  const templates = [
    { label: "Contact Form", value: "contact-form" },
    { label: "Order Placed", value: "order-placed" },
  ]

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
        <div className="flex items-center justify-between px-6 py-4">
          <Text>Choose template</Text>
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
        {selectedTemplate === "order-placed" && <OrderPlacedTemplate />}
      </Container>
    </SingleColumnPage>  
  )
}

export const config = defineRouteConfig({
  label: "Preview Template",
  icon: ChatBubbleLeftRight,
})

export default PreviewTemplatePage
