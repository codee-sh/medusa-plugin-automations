import { Theme, getFontFamily } from "../../theme";
import { defaultTheme } from "../../theme/presets/default";

interface SectionTextOptions {
  theme?: Theme;
  twoColumn?: boolean;
  spacing?: "default" | "alt";
  hasBackground?: boolean;
  contentOnly?: boolean;
}

const sectionText = (
  label: string,
  value: string,
  options: SectionTextOptions = {}
) => {
  const theme = options.theme || defaultTheme;
  const fontFamily = getFontFamily(theme);
  const twoColumn = options.twoColumn || false;
  
  const spacingConfig = theme.spacing.section;
  const basePadding = spacingConfig.inner;

  let content: string;

  if (twoColumn) {
    content = `
      <mj-column width="50%">
        <mj-text 
          font-size="${theme.typography.label.fontSize}" 
          font-weight="${theme.typography.label.fontWeight}" 
          color="${theme.colors.text.primary}" 
          text-transform="${theme.typography.label.textTransform}" 
          letter-spacing="${theme.typography.label.letterSpacing}"
          padding-bottom="0"
          font-family="${fontFamily}"
        >
          ${label}
        </mj-text>
      </mj-column>
      <mj-column width="50%">
        <mj-text 
          font-size="${theme.typography.body.fontSize}" 
          color="${theme.colors.text.secondary}" 
          padding-top="0"
          padding-bottom="0"
          font-family="${fontFamily}"
          line-height="${theme.typography.body.lineHeight}"
          align="right"
        >
          ${value}
        </mj-text>
      </mj-column>
    `.trim();
  } else {
    content = `
      <mj-column>
        <mj-text 
          font-size="${theme.typography.label.fontSize}" 
          font-weight="${theme.typography.label.fontWeight}" 
          color="${theme.colors.text.primary}" 
          text-transform="${theme.typography.label.textTransform}" 
          letter-spacing="${theme.typography.label.letterSpacing}"
          padding-bottom="8px"
          font-family="${fontFamily}"
        >
          ${label}
        </mj-text>
        <mj-text 
          font-size="${theme.typography.body.fontSize}" 
          color="${theme.colors.text.secondary}" 
          padding-top="${theme.spacing.text}" 
          padding-bottom="${theme.spacing.text}"
          font-family="${fontFamily}"
          line-height="${theme.typography.body.lineHeight}"
        >
          ${value}
        </mj-text>
      </mj-column>
    `.trim();
  }

  return `
    <mj-section padding="${basePadding}">
      ${content}
    </mj-section>
  `.trim();
};

export default sectionText;

