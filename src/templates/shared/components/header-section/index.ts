import { Theme, getFontFamily } from "../../theme";
import { defaultTheme } from "../../theme/presets/default";

interface SectionHeaderOptions {
  theme?: Theme;
}

const sectionHeader = (
  text: string,
  options: SectionHeaderOptions = {}
) => {
  const theme = options.theme || defaultTheme;
  const fontFamily = getFontFamily(theme);

  return `
    <mj-section padding="${theme.spacing.header.outer}">
      <mj-section background-color="${theme.colors.primary}" padding="${theme.spacing.header.inner}">
        <mj-column>
          <mj-text 
            align="center" 
            color="${theme.colors.primaryText}" 
            font-size="${theme.typography.header.fontSize}" 
            font-weight="${theme.typography.header.fontWeight}" 
            line-height="${theme.typography.header.lineHeight}"
            font-family="${fontFamily}"
          >
            ${text}
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-section>
  `.trim();
};

export default sectionHeader;

