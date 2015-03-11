  [![gitter][gitter-image]][gitter-url]
  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![Test coverage][coveralls-image]][coveralls-url]

  Expressive middleware for node.js using generators via [co](https://github.com/visionmedia/co)
  to make web applications and APIs more enjoyable to write. Co-mws middleware flow in a stack-like manner exactly like koa onws. Use of generators also greatly increases the readability and robustness of your application.

  
## Installation

```
$ npm install co-mws --save
```

  Co-mws is supported in all versions of [iojs](https://iojs.org) without any flags.

  To use co-mws with node, you must be running __node 0.12.__ or higher for generator and promise support.

## Getting started

TBD

## Example

```js
var CoMws = require('co-mws');
var mws = new CoMws();

mws.use(function *(next){
    this.result += ' hello';
    yield next();
});

mws.use(function *(next){
    this.result += ' world';
    yield next();
});

var ctx = {result:'yet another'};

mws.run(ctx).then(function(){
  //ctx.result === 'yet another hello world'
});

```

## Running tests

```
$ npm install && npm test
```

## Authors

  - [Andrea Parodi](https://github.com/parro-it)

# License

  MIT

[npm-image]: https://img.shields.io/npm/v/co-mws.svg?style=flat-square
[npm-url]: https://npmjs.org/package/co-mws
[travis-image]: https://img.shields.io/travis/shes/co-mws/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/shes/co-mws
[coveralls-image]: https://img.shields.io/coveralls/shes/co-mws/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shes/co-mws?branch=master
[gitter-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/shes/co-mws?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge