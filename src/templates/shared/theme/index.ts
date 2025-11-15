/**
 * Theme configuration for email templates
 *
 * This file contains the Theme interface and utility functions.
 * The default theme implementation is in the 'presets/default' folder.
 */

export interface Theme {
  colors: {
    primary: string;
    primaryText: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border: string;
  };
  fonts: {
    primary: string;
    fallback: string;
  };
  spacing: {
    sectionWrapper: {
      outer: string;
      inner: string;
    };
    section: {
      outer: string;
      inner: string;
    };
    header: {
      outer: string;
      inner: string;
    };
    text: string;
    divider: string;
  };
  typography: {
    header: {
      fontSize: string;
      fontWeight: string;
      lineHeight: string;
    };
    label: {
      fontSize: string;
      fontWeight: string;
      textTransform: string;
      letterSpacing: string;
    };
    body: {
      fontSize: string;
      lineHeight: string;
    };
    footer: {
      fontSize: string;
    };
  };
}

/**
 * Get font family string combining primary and fallback fonts
 */
export function getFontFamily(theme: Theme): string {
  return `${theme.fonts.primary}, ${theme.fonts.fallback}`;
}

