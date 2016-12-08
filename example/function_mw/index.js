'use strict';

const CoMws = require('comws');

const mws = new CoMws();

// eslint-disable-next-line require-yield, no-unused-vars
mws.use(function (next) {
	const _this = this;

	_this.result += '\n first at ' + new Date().getTime();
	return next().then(function () {
		_this.result += '\n after second at ' + new Date().getTime();
	});
});

// eslint-disable-next-line require-yield, no-unused-vars
mws.use(function * (next) {
	this.result += '\n second running at ' + new Date().getTime();

	return new Promise(function (resolve) {
		setTimeout(resolve, 1000);
	});
});

const ctx = {result: 'start at ' + new Date().getTime()};

mws.run(ctx).then(function () {
	process.stderr.write(ctx.result);
});
