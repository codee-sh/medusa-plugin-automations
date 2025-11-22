/**
 * Default theme configuration
 *
 * You can override this theme by creating a custom theme object
 * and passing it to template functions.
 * 
 * Custom colors use 'ui' namespace (same as Medusa UI):
 * - bg-ui-bg for background color
 * - text-ui-text for text color
 * - border-ui-border for border color
 * - bg-ui-button for button background
 * - text-ui-button-text for button text
 * 
 * Change these values to globally update colors across all templates.
 * Example: Change ui.bg from "#ffffff" to "#000000" to make background black.
 */
export const defaultTheme: any = {
  extend: {
    fontFamily: {
      normal: "Arial",
    },
    colors: {
      ui: {
        bg: "#ffffff",        // Background color (white) - use with bg-ui-bg
        text: "#000000",      // Text color (black) - use with text-ui-text
        border: "#d1d5db",    // Border color (gray-300) - use with border-ui-border
        button: "#000000",    // Button background (black) - use with bg-ui-button
        "button-text": "#ffffff", // Button text (white) - use with text-ui-button-text
      },
    },
  },
};

