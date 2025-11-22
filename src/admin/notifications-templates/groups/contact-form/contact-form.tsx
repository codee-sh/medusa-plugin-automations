import { useEffect, useState } from "react";
import { Alert } from "@medusajs/ui";
import { usePreview } from "../../../../hooks/api/preview";
import { contactFormMockData } from "../../../../../emails-previews/contact-form";
import { TEMPLATES_NAMES } from "../../../../templates/emails";

export const ContactFormTemplate = () => {
  const [templateData, setTemplateData] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any>(null);

  useEffect(() => {
    setTemplateData(contactFormMockData);
  }, []);

  const { data: preview, isLoading: isPreviewLoading } = usePreview({
    templateName: TEMPLATES_NAMES.CONTACT_FORM,
    templateData: templateData,
    locale: "pl",
    enabled: !!templateData,
    extraKey: [templateData],
  });

  useEffect(() => {
    if (preview) {
      setPreviewData(preview);
    }
  }, [preview]);

  return (
    <div className="px-6 py-4">
      {isPreviewLoading && (
        <Alert variant="info">Loading preview...</Alert>
      )}
      {previewData && (
        <div className="px-6 py-4">
          <iframe
            srcDoc={previewData?.html || ""}
            style={{ width: "100%", border: "none", minHeight: "600px" }}
            sandbox="allow-same-origin"
          />
        </div>
      )}
    </div>
  );
};
