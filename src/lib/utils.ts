/**
 * Pure utility functions shared between server and client code.
 * No Node.js-only imports (fs, path, etc.) allowed here.
 */

/** Convert a human-readable category name to a URL slug. */
export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
