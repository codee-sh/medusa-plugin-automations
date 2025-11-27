import React from "react";
import { Html, Tailwind, Head, Text, Body, Container, pixelBasedPreset, Section, Row, Column, Heading, Button, Hr } from "@react-email/components";
import { render, pretty, toPlainText } from "@react-email/render";
import { InventoryLevelUpdatedTemplateDataType } from "./types";
import { TemplateOptionsType } from "../types";
import { escapeHtml } from "../../shared/utils";

export function renderHTMLReact(
  data: InventoryLevelUpdatedTemplateDataType,
  options: TemplateOptionsType
): React.ReactNode {
  const theme = options.theme || {};
  const i18n = options.i18n;
  
  if (!i18n) {
    throw new Error("i18n is required in options. It should be provided by renderTemplate.");
  }

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
                <Column className="font-semibold">{i18n.t('labels.productTitle', data)}</Column>
                <Column className="text-right">{escapeHtml(data.inventory_item.title)}</Column>
              </Row>
            </Section>

            <Hr className="my-4 border-ui-border" />

            {/* Order Number */}
            <Section>
              <Row>
                <Column className="font-semibold">{i18n.t('labels.inventoryLevelStockedQuantity', data)}</Column>
                <Column className="text-right">{escapeHtml(data.inventory_level.stocked_quantity)}</Column>
              </Row>
            </Section>

            <Hr className="my-4 border-ui-border" />

            {/* Order Date */}
            <Section>
              <Row>
                <Column className="font-semibold">{i18n.t('labels.inventoryLevelReservedQuantity', data)}</Column>
                <Column className="text-right">{escapeHtml(data.inventory_level.reserved_quantity)}</Column>
              </Row>
            </Section>

            <Hr className="my-4 border-ui-border" />

            {/* Order Date */}
            <Section>
              <Row>
                <Column className="font-semibold">{i18n.t('labels.inventoryLevelAvailableQuantity', data)}</Column>
                <Column className="text-right">{escapeHtml(data.inventory_level.available_quantity)}</Column>
              </Row>
            </Section>

            <Hr className="my-4 border-ui-border" />

            {/* Order Date */}
            <Section>
              <Row>
                <Column className="font-semibold">{i18n.t('labels.inventoryLevelLocation', data)}</Column>
                <Column className="text-right">{escapeHtml(data.location.id)}</Column>
              </Row>
            </Section>

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
  data: InventoryLevelUpdatedTemplateDataType,
  options: TemplateOptionsType
): Promise<any> {
  return await pretty(await render(renderHTMLReact(data, options)));
}

export async function renderText(
  data: InventoryLevelUpdatedTemplateDataType,
  options: TemplateOptionsType
): Promise<any> {
  const html = await render(renderHTMLReact(data, options));
  return toPlainText(html);
}