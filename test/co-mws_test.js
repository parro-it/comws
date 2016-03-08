'use strict';

const CoMws = require('../src');
const co = require('co');
const test = require('tape');

const setupMws = co.wrap(function *() {
  const  mws = new CoMws();
  const ctx = {result: 'yet another'};

  mws.use(function *(next) {
    this.result += yield Promise.resolve(' hello');
    yield next();
  });

  mws.use(function *(next) {
    this.result += yield Promise.resolve(' world');
    yield next();
  });

  yield mws.run(ctx);

  return {mws, ctx};
});

const setupErrorMws = co.wrap(function *() {
  const  mws = new CoMws();
  mws.use(function *(next) {
    this.result = ('hello');
    yield next();
  });

  mws.use(function *() {
    throw new Error('test-error');
  });

  mws.use(function *(ctx, err, next) {  // eslint-disable-line
    ctx.ex = err;
  });

  const ctx = {};

  yield mws.run(ctx);

  return {mws, ctx};
});

test('register all mws', t => {
  setupMws().then(ctx => {
    t.equal(ctx.mws.mws.length, 2);
    t.end();
  });
});

test('can construct instance', t => {
  setupMws().then(ctx => {
    t.equal(typeof ctx.mws, 'object');
    t.end();
  }).catch(err => t.end(err));
});

test('execute all mws', t => {
  setupMws().then(ctx => {
    t.equal(ctx.ctx.result, 'yet another hello world');
    t.end();
  });
});

test('handle errors', t => {
  setupErrorMws().then(ctx => {
    t.equal(ctx.ctx.ex.message, 'test-error');
    t.end();
  }).catch(err => t.end(err));
});

test('allow function mw returning next', t => {
  let mws;
  const ctx = {};

  co( function *() {
    mws = new CoMws();

    mws.use(function(next) {
      this.result = 'hello';
      return next();
    });

    mws.use(function *(next) {
      this.result += ' world';
      next();
    });

    yield mws.run(ctx);

  }).then(() => {
    t.equal(ctx.result, 'hello world');
    t.end();
  });
});

test('allow function mw returning a promise', t => {
  let mws;
  const ctx = {};

  co( function *() {
    mws = new CoMws();

    mws.use(function(next) {
      return new Promise((resolve) => {
        next().then(()=>{
          this.result += ' world';
          resolve();
        });
      });
    });

    mws.use(function *(next) {
      this.result = 'hello';
      next();
    });

    yield mws.run(ctx);
  }).then(() => {
    t.equal(ctx.result, 'hello world');
    t.end();
  });

});

test('allow function mw returning a normal value', t => {
  let mws;
  const ctx = {};

  co( function *() {
    mws = new CoMws();

    mws.use(function * (next) {
      this.result = yield Promise.resolve('hello');
      yield next();
    });

    mws.use(function * (next) {
      this.result += ' world';
      yield next();
      return null;
    });


    yield mws.run(ctx);

  }).then(() => {
    t.equal(ctx.result, 'hello world');
    t.end();
  });
});

test('allow generators, arrow and normal function with ctx arg', t => {
  let mws;
  const ctx = {};

  co( function *() {
    mws = new CoMws();

    mws.use((c, next) => {
      c.result = 'hello';
      return next();
    });

    mws.use((c, next) => {
      c.result += ' magic';
      return next();
    });

    mws.use((c, next) => {
      c.result += ' world';
      next();
    });


    yield mws.run(ctx);

  }).then(() => {
    t.equal(ctx.result, 'hello magic world');
    t.end();
  });
});


