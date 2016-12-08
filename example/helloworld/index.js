const CoMws = require('comws');

const mws = new CoMws();

mws.use(function * (next) {
	this.result += ' hello';
	yield next();
});

mws.use(function * (next) {
	this.result += ' world';
	yield next();
});

const ctx = {result: 'yet another'};

mws.run(ctx).then(function () {
	process.stdout.write(ctx.result);
});
