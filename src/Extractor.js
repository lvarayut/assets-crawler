'use strict';

const Url = require('./Url');

/**
 * Extractor is responsible for extracting urls and assets.
 * All of its methods are pure functions (Shouldn't have any side effect)
 */
class Extractor {
  /**
   * Find all attributes of the given tag on the page
   * @param $
   * @param tag
   * @param attr
   * @returns {jQuery}
   */
  static findAttributes($, tag, attr) {
    return $('html').find(tag).map(function () {
      return $(this).attr(attr);
    }).get();
  }

  /**
   * Extract all urls, verify them, and put them into the queue
   * @param $
   * @param seedUrl
   * @param queue
   * @param visited
   * @returns {Array}
   */
  static extractUrls($, seedUrl, queue, visited) {
    // Clone the queue, so, there is no side effect with the original queue
    queue = [...queue];

    // Get all href values from <a> tags, ignore any links started with "#", "javascript:", or empty
    const urls = Extractor.findAttributes($, 'a:not([href^="#"]):not([href^="javascript:"]):not([href=""])', 'href');

    // Add all urls that have never been visited
    for (let i = 0; i < urls.length; i++) {
      // Normalize each url and transform a relative path to a absolute path, if necessary
      const url = Url.normalize(urls[i], seedUrl.href);

      // Check if the url is in the same domain, have never visited, and wasn't already in the queue
      if (!visited.has(url.href) && seedUrl.host === url.host && queue.indexOf(url.href) === -1) {
        queue.push(url);
      }
    }

    return queue;
  }

  /**
   * Extract all assets  add them the the map
   * @param $
   * @param currentUrl
   * @param assets
   * @returns {Map}
   */
  static extractAssets($, currentUrl, assets) {
    // Clone the assets, so, there is no side effect with the original assets
    assets = new Map(assets);

    // Find all image, javascript, and stylesheet files
    const images = Extractor.findAttributes($, 'img', 'src');
    const javaScripts = Extractor.findAttributes($, 'script[src$=".js"]', 'src');
    const styleSheets = Extractor.findAttributes($, 'link[href$=".css"]', 'href');
    const newAssets = [...images, ...javaScripts, ...styleSheets];

    // Add the assets to the assets map
    for (let i = 0; i < newAssets.length; i++) {
      const newAsset = Url.normalize(newAssets[i], currentUrl.href);
      if (currentUrl.host === newAsset.host) {
        if (assets.has(currentUrl.href)) {
          assets.set(currentUrl.href, [...assets.get(currentUrl.href), newAsset.href]);
        } else {
          assets.set(currentUrl.href, [newAsset.href]);
        }
      }
    }

    return assets;
  }
}

module.exports = Extractor;
