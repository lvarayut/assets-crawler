import test from 'ava';
import sinon from 'sinon';
import cheerio from 'cheerio';

import Crawler from '../src/Crawler';

test('sendRequest should return a valid jQuery like', async t => {
  const $ = await Crawler.sendRequest('http://google.com', 10000);
  t.truthy($);
});

test('sendRequest should reject in case of wrong url', t => {
  t.throws(Crawler.sendRequest('http://foo.baz', 10000));
});

test('showResult should return all assets in JSON format', t => {
  const assets = new Map();
  assets.set('http://google.com', ['http://google.com/foo.png', 'http://google.com/bar.js']);
  const result = Crawler.showResult(assets);
  const expected = [{
    url: 'http://google.com',
    assets: [
      'http://google.com/foo.png',
      'http://google.com/bar.js'
    ]
  }];
  t.deepEqual(JSON.parse(result), expected);
});

test.serial('crawl should print a result to studout', async t => {
  const $ = cheerio.load('<html><img src="bar.png"><link href="baz.css"><script src="toto.js"></html>');

  // Stub console.log() and Crawler.sendRequest, so, the real functions won't be called
  sinon.stub(console, 'log');
  sinon.stub(Crawler, 'sendRequest', () => {
    return Promise.resolve($);
  });

  const crawler = new Crawler('http://foo.bar', {});

  await new Promise(resolve => {
    crawler.crawl(result => {
      console.log(result);
      resolve();
    });
  });

  t.true(Crawler.sendRequest.calledOnce);
  t.true(console.log.calledOnce);

  Crawler.sendRequest.restore();
  console.log.restore();
});

test.serial('crawl should decrease the number of open connections even when the sendRequest function failed', async t => {
  const crawler = new Crawler('http://foo.bar', {debug: true});
  sinon.stub(console, 'error');
  sinon.stub(Crawler, 'sendRequest', () => {
    return Promise.reject();
  });

  await new Promise(resolve => {
    crawler.crawl(() => {
      resolve();
    });
  });

  t.is(crawler.openConnections, 0);
  t.true(console.error.calledOnce);

  Crawler.sendRequest.restore();
  console.error.restore();
});
