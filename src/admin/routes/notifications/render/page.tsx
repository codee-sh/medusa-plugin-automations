import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import { useState } from "react";
import { Container, Heading, Select, Text } from "@medusajs/ui";
import { SingleColumnPage } from "../../../components/layout/pages";
import { OrderTemplateGroup } from "../../../notifications-templates/groups/order/order";

const PreviewTemplatePage = () => {
  const templateName = "";
  const [selectedTemplate, setSelectedTemplate] =
    useState<string>(templateName);
  const templates = [
    { label: "Contact Form", value: "contact-form" },
    { label: "Order", value: "order" },
  ];

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
          {selectedTemplate && (
            <div className="divide-y p-0">
              <div className="flex items-center justify-between px-6 py-4">
                <Heading level="h2">Choose template type:</Heading>
              </div>
              {selectedTemplate === "order" && <OrderTemplateGroup />}
            </div>
          )}
        </div>
      </Container>
    </SingleColumnPage>
  );
};

export const config = defineRouteConfig({
  label: "Preview Template",
  icon: ChatBubbleLeftRight,
});

export default PreviewTemplatePage;
