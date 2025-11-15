import { Locale } from "./types";
import { Theme } from "../theme";

/**
 * Base options interface for all email templates
 * All template options should extend this interface
 */
export interface TemplateOptions {
  theme?: Theme;
  locale?: Locale;
}

