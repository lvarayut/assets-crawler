'use strict';

const cheerio = require('cheerio');
const request = require('request');
const chalk = require('chalk');

const Extractor = require('./Extractor');
const Url = require('./Url');

/**
 * Crawler is the main class used to handle assets crawling,
 * it contains both static and instance methods.
 * The static methods (Pure functions) are used as much as possible
 * for the sake of testability and no side-effect
 */
class Crawler {
  constructor(seedUrl, {maxConnections = 1000, requestInterval = 200, timeout = 10000, debug = false}) {
    this.assets = new Map();
    this.visited = new Set();
    this.seedUrl = Url.normalize(seedUrl);
    this.maxConnections = maxConnections;
    this.requestInterval = requestInterval;
    this.timeout = timeout;
    this.debug = debug;
    this.queue = [this.seedUrl];
    this.openConnections = 0;
  }

  /**
   * Send a request to a given url
   * @param url
   * @param timeout
   * @returns {Promise}
   */
  static sendRequest(url, timeout) {
    // Wrap the request function with Promise to prevent "callback hell!"
    return new Promise((resolve, reject) => {
      request({url, timeout}, (err, response, html) => {
        // Handle in case of fetching error
        if (err || response.statusCode !== 200) {
          return reject(`Error while fetching the ${url}, ${err || response.statusCode}`);
        }

        // Load in the returned html
        return resolve(cheerio.load(html));
      });
    });
  }

  /**
   * Print out all the assets into the standard output
   * in the form of JSON format
   * @param assetsMap
   */
  static showResult(assetsMap) {
    const result = [];
    // Iterate through the assets map
    for (const [url, assets] of assetsMap) {
      result.push({url, assets});
    }

    // Return the result in JSON format with 2 spaces for readability
    return JSON.stringify(result, null, 2);
  }

  /**
   * Start crawling urls recursively until the queue is empty and the open connections is zero,
   * then, the result will be printed into the standard output
   * @param callback
   */
  crawl(callback) {
    // Check whether the current open connections exceed the maximal connections or not,
    // or the queue is still empty but there are some open connections
    if ((this.openConnections >= this.maxConnections) || (!this.queue.length && this.openConnections)) {
      // Try to call again after the set request interval
      return setTimeout(this.crawl.bind(this, callback), this.requestInterval);
    } else if (!this.openConnections && !this.queue.length) {
      return callback(Crawler.showResult(this.assets));
    }

    // Get a url, add it to the visited set, and increase the number of open connections
    const url = this.queue.shift();
    this.visited.add(url.href);
    this.openConnections += 1;

    // Send a request and decrease the number of open connections
    Crawler.sendRequest(url.href, this.timeout).then($ => {
      this.queue = Extractor.extractUrls($, this.seedUrl, this.queue, this.visited);
      this.assets = Extractor.extractAssets($, url, this.assets);
      this.openConnections -= 1;
    }).catch(err => {
      if (this.debug) {
        console.error(chalk.red(err));
      }
      this.openConnections -= 1;
    });

    // Recursively call itself
    this.crawl(callback);
  }
}

module.exports = Crawler;
