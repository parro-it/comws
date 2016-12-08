const CoMws = require('comws');

const mws = new CoMws();

// eslint-disable-next-line require-yield, no-unused-vars
mws.use(function * (next) {
	throw new Error('Yike!');
});

// eslint-disable-next-line require-yield, no-unused-vars
mws.use(function * (ctx, err, next) {
	process.stderr.write(err.message);
});

mws.run();
