import React from "react";
import { Html, Tailwind, Head, Text, Body, Container, pixelBasedPreset, Section, Row, Column, Heading, Hr } from "@react-email/components";
import { render, pretty } from "@react-email/render";
import { ContactFormTemplateDataType } from "./types";
import { TemplateOptionsType } from "../types";
import { escapeHtml } from "../../shared/utils";

export function renderHTMLReact(
  data: ContactFormTemplateDataType,
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
                {escapeHtml(data.subject)}
              </Heading>
            </Section>

            <Hr className="my-4 border-ui-border" />

            {/* Name */}
            <Section>
              <Row>
                <Column className="font-semibold">{i18n.t('labels.name', data)}</Column>
                <Column className="text-right">{escapeHtml(data.name)}</Column>
              </Row>
            </Section>

            <Hr className="my-4 border-ui-border" />

            {/* Email */}
            <Section>
              <Row>
                <Column className="font-semibold">{i18n.t('labels.email', data)}</Column>
                <Column className="text-right">{escapeHtml(data.email)}</Column>
              </Row>
            </Section>

            <Hr className="my-4 border-ui-border" />

            {/* Phone */}
            {data.phone && (
              <>
                <Section>
                  <Row>
                    <Column className="font-semibold">{i18n.t('labels.phone', data)}</Column>
                    <Column className="text-right">{escapeHtml(data.phone)}</Column>
                  </Row>
                </Section>
                <Hr className="my-4 border-ui-border" />
              </>
            )}

            {/* Message */}
            <Section>
              <Text className="font-semibold m-0 p-0">{i18n.t('labels.message', data)}</Text>
              <Text className="m-0 p-0">{escapeHtml(data.message)}</Text>
            </Section>

            <Hr className="my-4 border-ui-border" />

            {/* Footer */}
            <Section>
              <Text className="text-sm text-ui-text text-center">
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
  data: ContactFormTemplateDataType,
  options: TemplateOptionsType
): Promise<any> {
  return await pretty(await render(renderHTMLReact(data, options)));
}

export async function renderText(
  data: ContactFormTemplateDataType,
  options: TemplateOptionsType
): Promise<any> {
  return await render(renderHTMLReact(data, options));
}

