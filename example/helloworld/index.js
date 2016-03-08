var CoMws = require('comws');
var mws = new CoMws();

mws.use(function *(next) {
  this.result += ' hello';
  yield next();
});

mws.use(function *(next) {
  this.result += ' world';
  yield next();
});

const ctx = {result: 'yet another'};

mws.run(ctx).then(function() {    // eslint-disable-line
  process.stdout.write(ctx.result);
});
