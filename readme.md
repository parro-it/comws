# comws

> Expressive middleware for node.js using generators via [co](https://github.com/visionmedia/co) to make node applications more enjoyable to write. Comws middleware flow in a stack-like manner exactly like koa ones. Use of generators also greatly increases the readability and robustness of your application.

[![Travis Build Status](https://img.shields.io/travis/parro-it/comws.svg)](http://travis-ci.org/parro-it/comws)
[![NPM module](https://img.shields.io/npm/v/comws.svg)](https://npmjs.org/package/comws)
[![NPM downloads](https://img.shields.io/npm/dt/comws.svg)](https://npmjs.org/package/comws)

# Installation

```bash
npm install comws --save
```

Comws is supported in all versions of node > 4.

# Getting started

See all example in example folder to get started.

Open an issue if you have any question or suggestion.

# Example

```js
var CoMws = require('comws');
var mws = new CoMws();

mws.use(function *(next){
  this.result += ' hello';
  yield next();
});

mws.use(function *(next){
  this.result += ' world';
  yield next();
});

var ctx = {result: 'yet another'};

mws.run(ctx).then(function() {
  //ctx.result === 'yet another hello world'
});

```

# Running tests

```
$ npm install && npm test
```


# License

The MIT License (MIT)

Copyright (c) 2016 parro-it
