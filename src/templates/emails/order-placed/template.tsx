import React from "react";
import { Html, Tailwind, Head, Text, Body, Container, pixelBasedPreset, Section, Row, Column, Heading, Button, Hr } from "@react-email/components";
import { render, pretty } from "@react-email/render";
import { OrderCreatedTemplateDataType } from "./types";
import { TemplateOptionsType } from "../types";
import { getTranslations } from "../../shared/i18n";
import { translations } from "./translations";
import { renderLabel, escapeHtml } from "../../shared/utils";

export function renderHTMLReact(
  data: OrderCreatedTemplateDataType,
  options: TemplateOptionsType
): React.ReactNode {
  const theme = options.theme || {};
  const locale = options.locale || "pl";
  const t = getTranslations(locale, translations, options.customTranslations);

  // Prepare items list
  const itemsList = data.items.map(
    (item) => `${escapeHtml(item.title)} - ${item.quantity}x ${escapeHtml(item.price)}`
  );

  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: theme
        }}
      >
        <Body className="mx-auto my-auto bg-white px-4 font-arial font-normal text-base">         
          <Container>
            <Section>
              <Heading className="text-xl text-center font-bold mb-4">
                {renderLabel(t.headerTitle, data)}
              </Heading>
              <Text className="text-center mb-4">
                {renderLabel(t.headerDescription, data)}
              </Text>
            </Section>

            <Hr className="my-4 border-gray-300" />

            {/* Sales Channel */}
            <Section>
              <Row>
                <Column className="font-semibold">{renderLabel(t.labels.salesChannel, data)}</Column>
                <Column className="text-right">{escapeHtml(data.sales_channel.name)}</Column>
              </Row>
            </Section>

            <Hr className="my-4 border-gray-300" />

            {/* Order Number */}
            <Section>
              <Row>
                <Column className="font-semibold">{renderLabel(t.labels.orderNumber, data)}</Column>
                <Column className="text-right">{escapeHtml(data.orderNumber)}</Column>
              </Row>
            </Section>

            <Hr className="my-4 border-gray-300" />

            {/* Order Date */}
            <Section>
              <Row>
                <Column className="font-semibold">{renderLabel(t.labels.orderDate, data)}</Column>
                <Column className="text-right">{escapeHtml(data.orderDate)}</Column>
              </Row>
            </Section>

            <Hr className="my-4 border-gray-300" />

            {/* Products */}
            <Section className="p-0">
              <Text className="font-semibold m-0 p-0">
                {renderLabel(t.labels.products, data)}
              </Text>
              <Text className="m-0 p-0">
                {itemsList.map((item, index) => (
                  <React.Fragment key={index}>
                    {item}
                    {index < itemsList.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </Text>
            </Section>

            <Hr className="my-4 border-gray-300" />

            {/* Shipping Address */}
            <Section>
              <Text className="font-semibold m-0 p-0">{renderLabel(t.labels.shippingAddress, data)}</Text>
              <Text 
                className="m-0 p-0"
                dangerouslySetInnerHTML={{ 
                  __html: data?.shippingAddress || t.noData 
                }}
              />
            </Section>

            <Hr className="my-4 border-gray-300" />

            {/* Summary Section with Background */}
            <Section className="bg-gray-50 p-4 rounded">
              <Row>
                <Column className="font-semibold">{renderLabel(t.labels.discountTotal, data)}</Column>
                <Column className="text-right">{escapeHtml(data.summary.discount_total)}</Column>
              </Row>
              <Row className="mt-2">
                <Column className="font-semibold">{renderLabel(t.labels.orderTotal, data)}</Column>
                <Column className="text-right">
                  {escapeHtml(data.summary.total)} {escapeHtml(data.summary.currency_code)}
                </Column>
              </Row>
              <Row className="mt-2">
                <Column className="font-semibold">{renderLabel(t.labels.paidTotal, data)}</Column>
                <Column className="text-right">
                  {escapeHtml(data.summary.paid_total)} {escapeHtml(data.summary.currency_code)}
                </Column>
              </Row>
              <Row className="mt-2">
                <Column className="font-semibold">{renderLabel(t.labels.taxTotal, data)}</Column>
                <Column className="text-right">{escapeHtml(data.summary.tax_total)}</Column>
              </Row>
            </Section>

            <Hr className="my-4 border-gray-300" />

            {/* View Order Button */}
            {data.orderUrl && (
              <>
                <Section className="text-center">
                  <Button
                    href={data.orderUrl}
                    className="bg-black text-white py-3 px-8 inline-block rounded"
                  >
                    {renderLabel(t.viewOrderButton, data)}
                  </Button>
                </Section>
                <Hr className="my-4 border-gray-300" />
              </>
            )}

            {/* Footer */}
            <Section>
              <Text className="text-sm text-gray-600 text-center">
                {renderLabel(t.footer, data)}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export async function renderHTML(
  data: OrderCreatedTemplateDataType,
  options: TemplateOptionsType
): Promise<any> {
  return await pretty(await render(renderHTMLReact(data, options)));
}

export async function renderText(
  data: OrderCreatedTemplateDataType,
  options: TemplateOptionsType
): Promise<any> {
  return await render(renderHTMLReact(data, options));
}