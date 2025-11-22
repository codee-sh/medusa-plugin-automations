export interface ContactFormTranslationsType {
  labels: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
  footer: string;
}

export type ContactFormTemplateDataType = {
  subject: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
};
