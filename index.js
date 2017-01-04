'use strict';

const chalk = require('chalk');
const logSymbols = require('log-symbols');

const Crawler = require('./src/Crawler');
const Url = require('./src/Url');

module.exports = (url, opts = {}) => {
  // Validate the url before starting
  if (!Url.isValidUrl(url)) {
    return console.error(chalk.red(`Error: expected a valid url, got ${url}`));
  }

  // Create a crawler instance
  const crawler = new Crawler(url, opts);

  // Show a status message. Use stderr to write to the console, so, this message won't be included in the result
  console.error(logSymbols.info, chalk.yellow('Start crawling assets...'));

  // Start crawling
  crawler.crawl(result => {
    // Show a successful message. Use stderr to write to the console, so, this message won't be included in the result
    console.error(logSymbols.success, chalk.green('Successful crawling!'));

    // Print out all the assets when all the urls have been crawled
    console.log(result);
  });
};
