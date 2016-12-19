const url = require('url');
const path = require('path');
const normalizeUrl = require('normalize-url');
const validator = require('validator');

/**
 * Url is responsible for validating and normalizing urls.
 * All of its methods are pure functions (Shouldn't have any side effect)
 */
class Url {
  /**
   * Validate whether the given url is correct url format or not
   * @param givenUrl
   * @returns boolean
   */
  static isValidUrl(givenUrl) {
    return validator.isURL(givenUrl);
  }

  /**
   * Simple URL normalization to make sure the url is in proper format,
   * it normalizes protocol, fragment, trailing slash, and uppercase
   * @param givenUrl
   * @param baseUrl
   * @returns {URL}
   */
  static normalize(givenUrl, baseUrl) {
    const isFullPath = givenUrl.slice(0, 4) === 'http';
    let normalizedUrl;

    // If the baseUrl is undefined or the give path is a full path, just normalize it,
    // else resolve the given path
    if (!baseUrl || isFullPath) {
      normalizedUrl = normalizeUrl(givenUrl, {stripWWW: false});
    } else if (path.isAbsolute(givenUrl)) {
      normalizedUrl = normalizeUrl(givenUrl, {stripWWW: false});
      normalizedUrl = url.resolve(baseUrl, normalizedUrl);
    } else {
      const currentUrl = url.parse(baseUrl);
      normalizedUrl = path.join(currentUrl.host, path.resolve(currentUrl.path, givenUrl));
      normalizedUrl = normalizeUrl(normalizedUrl, {stripWWW: false});
    }
    return url.parse(normalizedUrl);
  }
}

module.exports = Url;
