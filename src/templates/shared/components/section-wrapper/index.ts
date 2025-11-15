import { Theme } from "../../theme";
import { defaultTheme } from "../../theme/presets/default";

interface SectionWrapperOptions {
  theme?: Theme;
  spacing?: "default" | "alt";
  hasBackground?: boolean;
}

/**
 * Creates a section wrapper that can contain other components
 * Automatically uses inner spacing when background is set, outer spacing otherwise
 * 
 * @param content - HTML/MJML content to wrap
 * @param options - Optional theme, spacing variant, and background color
 */
const sectionWrapper = (
  content: string,
  options: SectionWrapperOptions = {}
) => {
  const theme = options.theme || defaultTheme;
  // const spacing = options.spacing || "default";
  const hasBackground = options.hasBackground;
  
  const spacingConfig = theme.spacing.sectionWrapper;
  const padding = hasBackground ? spacingConfig.outer : spacingConfig.inner;
  
  const backgroundAttr = hasBackground 
    ? `background-color="${theme.colors.surface}"` 
    : "";

  return `
    <mj-section ${backgroundAttr} padding="${padding}">
      ${content}
    </mj-section>
  `.trim();
};

export default sectionWrapper;

