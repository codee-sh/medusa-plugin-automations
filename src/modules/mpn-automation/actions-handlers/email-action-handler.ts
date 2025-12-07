import { FieldConfig } from "../types";
import { BaseActionHandler } from "./base-action-handler";

export class EmailActionHandler extends BaseActionHandler {
  id = "email";
  label = "Email";

  fields: FieldConfig[] = [
    {
      name: "to",
      key: "to",
      label: "To",
      type: "email" as const,
      required: true,
    },
    {
      name: "subject",
      key: "subject",
      label: "Subject",
      type: "text" as const,
      required: true,
    },
    {
      name: "body",
      key: "body",
      label: "Body",
      type: "textarea" as const,
      required: true,
    },
    {
      name: "bcc",
      key: "bcc",
      label: "BCC",
      type: "email" as const,
      required: false,
    },
    {
      name: "cc",
      key: "cc",
      label: "CC",
      type: "email" as const,
      required: false,
    },
    {
      name: "replyTo",
      key: "replyTo",
      label: "Reply To",
      type: "email" as const,
      required: false,
    },
    {
      name: "templateName",
      key: "templateName",
      label: "Template Name",
      type: "select" as const,
      required: true,
      options: [
        {
          label: "Inventory Level",
          value: "inventory-level",
        },
      ],
      defaultValue: "inventory-level",
    },
  ];
}
