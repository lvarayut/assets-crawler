# assets-crawler [![npm](https://img.shields.io/npm/v/assets-crawler.svg)](https://www.npmjs.com/package/assets-crawler) [![Build Status](https://travis-ci.org/lvarayut/assets-crawler.svg?branch=master)](https://travis-ci.org/lvarayut/assets-crawler) [![Coverage Status](https://coveralls.io/repos/github/lvarayut/assets-crawler/badge.svg?branch=master)](https://coveralls.io/github/lvarayut/assets-crawler?branch=master)


> Simple assets crawler that allows you to get all assets from a particular website via command-line

<img width="626" alt="Screenshot" src="https://cloud.githubusercontent.com/assets/4281887/21318151/aa774d84-c63a-11e6-83ee-d0f36077e029.png">

## Install

```
$ npm install --global assets-crawler
```

## Usage

```
$ assets-crawler --help

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
```

> In case of a huge result, you might want to save an output to a file by using `assets-crawler {url} > output.json`.

## License

MIT © [Varayut Lerdkanlayanawat](https://github.com/lvarayut)
