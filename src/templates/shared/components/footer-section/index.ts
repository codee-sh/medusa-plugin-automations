import { Theme, getFontFamily } from "../../theme";
import { defaultTheme } from "../../theme/presets/default";

interface SectionFooterOptions {
  theme?: Theme;
}

const sectionFooter = (
  message: string,
  options: SectionFooterOptions = {}
) => {
  const theme = options.theme || defaultTheme;
  const fontFamily = getFontFamily(theme);

  return `
    <mj-section background-color="${theme.colors.surface}" padding="${theme.spacing.section.inner}">
      <mj-column>
        <mj-text 
          align="center" 
          font-size="${theme.typography.footer.fontSize}" 
          color="${theme.colors.text.muted}" 
          padding="${theme.spacing.text}" 
          font-family="${fontFamily}"
        >
          ${message}
        </mj-text>
      </mj-column>
    </mj-section>
  `.trim();
};

export default sectionFooter;

