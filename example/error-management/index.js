var CoMws = require('comws');
var mws = new CoMws();

mws.use(function *(next) {  // eslint-disable-line
  throw new Error('Yike!');
});

mws.run();
