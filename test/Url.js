import test from 'ava';
import Url from '../src/Url';

test('isValidurl should return a boolean true', t => {
  t.true(Url.isValidUrl('http://www.google.com'));
  t.true(Url.isValidUrl('https://www.google.com'));
  t.true(Url.isValidUrl('www.google.com'));
  t.true(Url.isValidUrl('google.com'));
});

test('isValidurl should return a boolean false', t => {
  t.false(Url.isValidUrl('http://www.google.'));
  t.false(Url.isValidUrl('google'));
});

test('normalize should return a URL object with correct infomation', t => {
  const http = Url.normalize('http://www.google.com');
  const https = Url.normalize('https://www.google.com');
  const absolute = Url.normalize('/foo', 'http://www.google.com');
  const relative = Url.normalize('../bar', 'http://www.google.com/foo');

  t.is(http.href, 'http://www.google.com/');
  t.is(https.href, 'https://www.google.com/');
  t.is(absolute.href, 'http://www.google.com/foo');
  t.is(relative.href, 'http://www.google.com/bar');
});
