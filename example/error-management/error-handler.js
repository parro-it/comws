var CoMws = require('comws');
var mws = new CoMws();

mws.use(function *(next) {  // eslint-disable-line
  throw new Error('Yike!');
});

mws.use(function *(ctx, err, next) {  // eslint-disable-line
  process.stderr.write(err.message);
});

mws.run();
