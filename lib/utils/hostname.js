module.exports = function (url) {
  url = new URL(url);

  return url.hostname.replace('www.', '');
};
