import { Theme, getFontFamily } from "../../theme";
import { defaultTheme } from "../../theme/presets/default";

interface RichTextSectionOptions {
  theme?: Theme;
  align?: "left" | "center" | "right";
}

/**
 * Creates a rich text section for email templates
 * Useful for longer content, paragraphs, or formatted text
 * 
 * @param content - HTML content (will be escaped automatically)
 * @param options - Optional theme and alignment
 */
const richTextSection = (
  content: string,
  options: RichTextSectionOptions = {}
) => {
  const theme = options.theme || defaultTheme;
  const align = options.align || "left";
  const fontFamily = getFontFamily(theme);

  return `
    <mj-section padding="${theme.spacing.section.outer}">
      <mj-column>
        <mj-text 
          font-size="${theme.typography.body.fontSize}" 
          color="${theme.colors.text.secondary}" 
          padding="${theme.spacing.text}"
          font-family="${fontFamily}"
          line-height="${theme.typography.body.lineHeight}"
          align="${align}"
        >
          ${content}
        </mj-text>
      </mj-column>
    </mj-section>
  `.trim();
};

export default richTextSection;

