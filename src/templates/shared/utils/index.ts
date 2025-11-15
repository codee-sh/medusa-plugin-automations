/**
 * Utility functions for email templates
 */

/**
 * Escapes HTML special characters to prevent XSS attacks
 * 
 * @param text - Text to escape
 * @returns Escaped HTML string
 */
export function escapeHtml(text: string | undefined | null): string {
  if (text == null) {
    return "";
  }
  
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

