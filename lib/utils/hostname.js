/**
 * Get hostname from URL
 * @param {string} url - URL
 * @returns {string} Hostname
 */
export function hostname(url) {
  url = new URL(url);

  return url.hostname.replace("www.", "");
}
