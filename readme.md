  [![gitter][gitter-image]][gitter-url]
  [![NPM version][npm-image]][npm-url]
  [![build status][shippable-image]][shippable-url]
  [![Test coverage][coverage-image]][coverage-url]

  Expressive middleware for node.js using generators via [co](https://github.com/visionmedia/co)
  to make node applications more enjoyable to write. Comws middleware flow in a stack-like manner exactly like koa ones. Use of generators also greatly increases the readability and robustness of your application.

  
## Installation

```
$ npm install comws --save
```

  Comws is supported in all versions of [iojs](https://iojs.org) without any flags.

  To use comws with node, you must be running __node > 0.11.16__ or __node > 0.12.0__ for generator and promise support, and must run node with the --harmony-generators or --harmony flag.

## Getting started

TBD

## Example

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

[npm-image]: https://img.shields.io/npm/v/comws.svg?style=flat-square
[npm-url]: https://npmjs.org/package/comws
[shippable-image]: https://api.shippable.com/projects/55005c5b5ab6cc1352981ec6/badge?branchName=master
[shippable-url]: https://app.shippable.com/projects/55005c5b5ab6cc1352981ec6/builds/latest
[coverage-image]: https://img.shields.io/coveralls/shes/comws/master.svg?style=flat-square
[coverage-url]: #
[gitter-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/shes/comws