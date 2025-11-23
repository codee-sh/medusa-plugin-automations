import React from "react";
import { Html, Tailwind, Head, Text, Body, Container, pixelBasedPreset, Section, Row, Column, Heading, Button, Hr } from "@react-email/components";
import { render, pretty } from "@react-email/render";
import { OrderCompletedTemplateDataType } from "./types";
import { TemplateOptionsType } from "../types";
import { getTranslations } from "../../shared/i18n";
import { translations } from "./translations";
import { escapeHtml } from "../../shared/utils";

export function renderHTMLReact(
  data: OrderCompletedTemplateDataType,
  options: TemplateOptionsType
): React.ReactNode {
  const theme = options.theme || {};
  const locale = options.locale || "pl";
  const i18n = getTranslations(locale, translations, options.customTranslations);

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
        <Body className="mx-auto my-auto px-4 font-arial font-normal text-base bg-ui-bg text-ui-text">         
          <Container>
            <Section>
              <Heading className="text-xl text-center font-bold mb-4">
                {i18n.t('headerTitle', data)}
              </Heading>
              <Text className="text-center mb-4">
                {i18n.t('headerDescription', data)}
              </Text>
            </Section>

            <Hr className="my-4 border-ui-border" />

            {/* Sales Channel */}
            <Section>
              <Row>
                <Column className="font-semibold">{i18n.t('labels.salesChannel', data)}</Column>
                <Column className="text-right">{escapeHtml(data.sales_channel.name)}</Column>
              </Row>
            </Section>

            <Hr className="my-4 border-ui-border" />

            {/* Order Number */}
            <Section>
              <Row>
                <Column className="font-semibold">{i18n.t('labels.orderNumber', data)}</Column>
                <Column className="text-right">{escapeHtml(data.orderNumber)}</Column>
              </Row>
            </Section>

            <Hr className="my-4 border-ui-border" />

            {/* Order Date */}
            <Section>
              <Row>
                <Column className="font-semibold">{i18n.t('labels.orderDate', data)}</Column>
                <Column className="text-right">{escapeHtml(data.orderDate)}</Column>
              </Row>
            </Section>

            <Hr className="my-4 border-ui-border" />

            {/* Completed Date */}
            <Section>
              <Row>
                <Column className="font-semibold">{i18n.t('labels.completedDate', data)}</Column>
                <Column className="text-right">{escapeHtml(data.completedDate)}</Column>
              </Row>
            </Section>

            <Hr className="my-4 border-ui-border" />

            {/* Products */}
            <Section className="p-0">
              <Text className="font-semibold m-0 p-0">
                {i18n.t('labels.products', data)}
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

            <Hr className="my-4 border-ui-border" />

            {/* Shipping Address */}
            <Section>
              <Text className="font-semibold m-0 p-0">{i18n.t('labels.shippingAddress', data)}</Text>
              <Text 
                className="m-0 p-0"
                dangerouslySetInnerHTML={{ 
                  __html: data?.shippingAddress || i18n.noData 
                }}
              />
            </Section>

            <Hr className="my-4 border-ui-border" />

            {/* Summary Section with Background */}
            <Section className="bg-gray-50 p-4 rounded">
              <Row>
                <Column className="font-semibold">{i18n.t('labels.discountTotal', data)}</Column>
                <Column className="text-right">{escapeHtml(data.summary.discount_total)}</Column>
              </Row>
              <Row className="mt-2">
                <Column className="font-semibold">{i18n.t('labels.orderTotal', data)}</Column>
                <Column className="text-right">
                  {escapeHtml(data.summary.total)} {escapeHtml(data.summary.currency_code)}
                </Column>
              </Row>
              <Row className="mt-2">
                    <Column className="font-semibold">{i18n.t('labels.paidTotal', data)}</Column>
                <Column className="text-right">
                  {escapeHtml(data.summary.paid_total)} {escapeHtml(data.summary.currency_code)}
                </Column>
              </Row>
              <Row className="mt-2">
                <Column className="font-semibold">{i18n.t('labels.taxTotal', data)}</Column>
                <Column className="text-right">{escapeHtml(data.summary.tax_total)}</Column>
              </Row>
            </Section>

            <Hr className="my-4 border-ui-border" />

            {/* View Order Button */}
            {data.orderUrl && (
              <>
                <Section className="text-center">
                  <Button
                    href={data.orderUrl}
                    className="bg-ui-button text-ui-button-text py-3 px-8 inline-block rounded"
                  >
                    {i18n.t('viewOrderButton', data)}
                  </Button>
                </Section>
                <Hr className="my-4 border-ui-border" />
              </>
            )}

            {/* Footer */}
            <Section>
              <Text className="text-sm text-gray-600 text-center">
                {i18n.t('footer', data)}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export async function renderHTML(
  data: OrderCompletedTemplateDataType,
  options: TemplateOptionsType
): Promise<any> {
  return await pretty(await render(renderHTMLReact(data, options)));
}

export async function renderText(
  data: OrderCompletedTemplateDataType,
  options: TemplateOptionsType
): Promise<any> {
  return await render(renderHTMLReact(data, options));
}

