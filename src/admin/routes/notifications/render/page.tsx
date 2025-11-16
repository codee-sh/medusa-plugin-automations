import { useState } from "react";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import { Container, Heading, Select, Text } from "@medusajs/ui";
import { SingleColumnPage } from "../../../components/layout/pages";
import { OrderTemplateGroup } from "../../../notifications-templates/groups/order";
import { ContactFormTemplateGroup } from "../../../notifications-templates/groups/contact-form";
import { TEMPLATES_NAMES } from "../../../../templates/emails/types";

const PreviewTemplatePage = () => {
  const templateName = "";
  const [selectedTemplate, setSelectedTemplate] =
    useState<string>(templateName);
  const templates = [
    { label: "Contact Form", value: TEMPLATES_NAMES.CONTACT_FORM },
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
              {selectedTemplate === TEMPLATES_NAMES.CONTACT_FORM && <ContactFormTemplateGroup />}
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
