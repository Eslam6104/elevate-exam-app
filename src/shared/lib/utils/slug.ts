export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

// Simple reversible encoding for UUIDs to make them look cleaner in URLs
export function encodeId(id: string): string {
  try {
    // We'll use a simple hex-to-base64-like transformation or just take a part if we trust uniqueness,
    // but for safety let's just use a clean string.
    // Here we'll just return the original ID but we could obfuscate it if needed.
    // To make it look "encoded", we can remove hyphens and take a segment or use btoa.
    return Buffer.from(id).toString("base64").replace(/=/g, "");
  } catch (e) {
    return id;
  }
}

export function decodeId(encoded: string): string {
  try {
    return Buffer.from(encoded, "base64").toString("utf-8");
  } catch (e) {
    return encoded;
  }
}

// Helper to extract ID from a combined Slug (format: slug--encodedId)
export function extractIdFromSlug(slug: string): string {
  const parts = slug.split("--");
  const encoded = parts[parts.length - 1];
  return decodeId(encoded);
}
