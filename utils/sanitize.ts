import DOMPurify from 'dompurify';

/**
 * Sanitizes a string by stripping all HTML tags, returning only the text content.
 * @param text The string to sanitize.
 * @returns A sanitized string with HTML tags removed.
 */
export const sanitizeText = (text: string | undefined | null): string => {
  if (typeof text !== 'string') {
    return '';
  }
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};
