import { Theme } from "../../theme";
import { defaultTheme } from "../../theme/presets/default";

interface SectionDividerOptions {
  theme?: Theme;
}

const sectionDivider = (options: SectionDividerOptions = {}) => {
  const theme = options.theme || defaultTheme;

  return `
    <mj-section background-color="${theme.colors.background}" padding="${theme.spacing.section.inner}">
      <mj-column>
        <mj-divider border-color="${theme.colors.border}" border-width="1px" padding="${theme.spacing.divider}" />
      </mj-column>
    </mj-section>
  `.trim();
};

export default sectionDivider;

