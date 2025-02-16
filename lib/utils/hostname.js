export function hostname (url) {
  url = new URL(url);

  return url.hostname.replace('www.', '');
};
