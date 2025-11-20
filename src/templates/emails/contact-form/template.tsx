import React from "react";
import { Html, Tailwind, Head, Text, Body, Container, pixelBasedPreset, Section, Row, Column, Heading, Hr } from "@react-email/components";
import { render, pretty } from "@react-email/render";
import { ContactFormTemplateDataType } from "./types";
import { TemplateOptionsType } from "../types";
import { getTranslations } from "../../shared/i18n";
import { translations } from "./locales";
import { escapeHtml } from "../../shared/utils";

export function renderHTMLReact(
  data: ContactFormTemplateDataType,
  options: TemplateOptionsType
): React.ReactNode {
  const theme = options.theme || {};
  const locale = options.locale || "pl";
  const t = getTranslations(locale, translations, options.customTranslations);

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
                {escapeHtml(data.subject)}
              </Heading>
            </Section>

            <Hr className="my-4 border-gray-300" />

            {/* Name */}
            <Section>
              <Row>
                <Column className="font-semibold">{t.labels.name}</Column>
                <Column className="text-right">{escapeHtml(data.name)}</Column>
              </Row>
            </Section>

            <Hr className="my-4 border-gray-300" />

            {/* Email */}
            <Section>
              <Row>
                <Column className="font-semibold">{t.labels.email}</Column>
                <Column className="text-right">{escapeHtml(data.email)}</Column>
              </Row>
            </Section>

            <Hr className="my-4 border-gray-300" />

            {/* Phone */}
            {data.phone && (
              <>
                <Section>
                  <Row>
                    <Column className="font-semibold">{t.labels.phone}</Column>
                    <Column className="text-right">{escapeHtml(data.phone)}</Column>
                  </Row>
                </Section>
                <Hr className="my-4 border-gray-300" />
              </>
            )}

            {/* Message */}
            <Section>
              <Text className="font-semibold m-0 p-0">{t.labels.message}</Text>
              <Text className="m-0 p-0">{escapeHtml(data.message)}</Text>
            </Section>

            <Hr className="my-4 border-gray-300" />

            {/* Footer */}
            <Section>
              <Text className="text-sm text-gray-600 text-center">
                {t.footer}
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

