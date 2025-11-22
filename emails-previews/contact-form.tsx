import { renderHTMLReact } from "../src/templates/emails/contact-form/template";
import { ContactFormTemplateDataType } from "../src/templates/emails/contact-form/types";
import { defaultTheme } from "../src/templates/shared/theme"

export const contactFormMockData: ContactFormTemplateDataType = {
  subject: "Nowa wiadomość z formularza kontaktowego",
  name: "Test Name",
  email: "test@test.com",
  phone: "1234567890",
  message: "Test messages",
};

export default function ContactForm() {
  return renderHTMLReact(contactFormMockData, {
    locale: "pl",
    theme: defaultTheme
  });
}