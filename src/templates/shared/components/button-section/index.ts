import { Theme, getFontFamily } from "../../theme";
import { defaultTheme } from "../../theme/presets/default";

interface ButtonSectionOptions {
  theme?: Theme;
  align?: "left" | "center" | "right";
}

/**
 * Creates a button section for email templates
 * 
 * @param text - Button text
 * @param url - Button URL
 * @param options - Optional theme and alignment
 */
const buttonSection = (
  text: string,
  url: string,
  options: ButtonSectionOptions = {}
) => {
  const theme = options.theme || defaultTheme;
  const align = options.align || "center";
  const fontFamily = getFontFamily(theme);

  return `
    <mj-section background-color="${theme.colors.background}" padding="${theme.spacing.section.inner}">
      <mj-column>
        <mj-button 
          background-color="${theme.colors.primary}" 
          color="${theme.colors.primaryText}"
          font-family="${fontFamily}"
          font-size="${theme.typography.body.fontSize}"
          font-weight="600"
          href="${url}"
          align="${align}"
          border-radius="4px"
          padding="12px 24px"
        >
          ${text}
        </mj-button>
      </mj-column>
    </mj-section>
  `.trim();
};

export default buttonSection;

