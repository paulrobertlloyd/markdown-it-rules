/**
 * Get hostname from URL
 * @param {string} string - URL
 * @returns {string} Hostname
 */
export function hostname(string) {
  const url = new URL(string);

  return url.hostname.replace("www.", "");
}
