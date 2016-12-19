import url from 'url';
import test from 'ava';
import cheerio from 'cheerio';

import Extractor from '../src/Extractor';

test('findAttributes should return values of the given attribute', t => {
  const $link = cheerio.load('<html><p><a href="/foo">Link</a></p></html>');
  const $img = cheerio.load('<html><p><img src="foo.png"></p></html>');
  const $css = cheerio.load('<html><p><link href="foo.css"></p></html>');
  const $js = cheerio.load('<html><p><script src="foo.js"></p></html>');

  t.deepEqual(Extractor.findAttributes($link, 'a', 'href'), ['/foo']);
  t.deepEqual(Extractor.findAttributes($img, 'img', 'src'), ['foo.png']);
  t.deepEqual(Extractor.findAttributes($css, 'link', 'href'), ['foo.css']);
  t.deepEqual(Extractor.findAttributes($js, 'script', 'src'), ['foo.js']);
});

test('extractUrl should return an updated queue', t => {
  const $ = cheerio.load('<html><a href="/baz"></a><a href="toto"></a><a href="#tutu"></a></html>');
  const seedUrl = url.parse('http://google.com');
  const fooUrl = url.parse('http://google.com/foo');
  const barUrl = url.parse('http://google.com/bar');
  const bazUrl = url.parse('http://google.com/baz');
  const totoUrl = url.parse('http://google.com/toto');
  const queue = [fooUrl, barUrl];
  const visited = new Set([totoUrl.href]);
  const updatedQueue = Extractor.extractUrls($, seedUrl, queue, visited);

  t.is(updatedQueue.length, 3);
  t.deepEqual(updatedQueue, [fooUrl, barUrl, bazUrl]);
});

test('extractAssets should return an updated assets', t => {
  const $ = cheerio.load('<html><img src="bar.png"><link href="baz.css"><script src="toto.js"></html>');
  const currentUrl = url.parse('http://google.com/foo');
  const assets = new Map();
  const updatedAssets = Extractor.extractAssets($, currentUrl, assets);
  const expected = new Map();
  expected.set(currentUrl.href, [
    'http://google.com/foo/bar.png',
    'http://google.com/foo/baz.css',
    'http://google.com/foo/toto.js'
  ]);

  t.deepEqual(updatedAssets, expected);
});
