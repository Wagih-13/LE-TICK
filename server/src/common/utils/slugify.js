/**
 * Slugify Utility
 * Convert strings to URL-friendly slugs
 */

/**
 * Generate slug from string
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

/**
 * Generate unique slug with timestamp
 */
export const generateUniqueSlug = (text) => {
  const baseSlug = slugify(text);
  const timestamp = Date.now();
  return `${baseSlug}-${timestamp}`;
};
