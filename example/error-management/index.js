const CoMws = require('comws');

const mws = new CoMws();

// eslint-disable-next-line require-yield, no-unused-vars
mws.use(function * (next) {
	throw new Error('Yike!');
});

mws.run();
