#!/usr/bin/env node
'use strict';

const meow = require('meow');
const assetsCrawler = require('./');

const cli = meow(`
	Usage
	  $ assets-crawler [url]

	Options
	  --maxConnections  Maximum concurrent connections [Default: 1000]
	  --requestInterval  Delay time in milliseconds before spawning a new connection [Default: 200]
	  --timeout  Waiting time for a server to response[Default: 10000]
	  --debug  If true, all errors from requests will be printed to stderr [Default: false]

	Examples
	  $ assets-crawler facebook.github.io/graphql
    [
      {
        "url": "http://facebook.github.io/graphql",
        "assets": [
          "http://facebook.github.io/graphql/spec.css",
          "http://facebook.github.io/graphql/highlight.css"
        ]
      }
    ]
`);

assetsCrawler(cli.input[0]);
