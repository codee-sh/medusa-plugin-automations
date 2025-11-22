import { renderHTMLReact } from "../src/templates/emails/contact-form/template";
import { ContactFormTemplateDataType } from "../src/templates/emails/contact-form/types";
import { defaultTheme } from "../src/templates/shared/theme"

export default function ContactForm() {
  const mockData: ContactFormTemplateDataType = {
    subject: "Test Contact Form",
    name: "Jan Kowalski",
    email: "jan@example.com",
    phone: "+48 123 456 789",
    message: "To jest przykładowa wiadomość do podglądu w React Email dev server."
  };

  return renderHTMLReact(mockData, {
    locale: "pl",
    theme: defaultTheme
  });
}