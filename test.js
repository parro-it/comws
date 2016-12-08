import co from 'co';
import test from 'ava';
import CoMws from '.';

const setupMws = co.wrap(function * () {
	const	mws = new CoMws();
	const ctx = {result: 'yet another'};

	mws.use(function * (next) {
		this.result += yield Promise.resolve(' hello');
		yield next();
	});

	mws.use(function * (next) {
		this.result += yield Promise.resolve(' world');
		yield next();
	});

	yield mws.run(ctx);

	return {mws, ctx};
});

const setupErrorMws = co.wrap(function * () {
	const	mws = new CoMws();
	mws.use(function * (next) {
		this.result = ('hello');
		yield next();
	});

	// eslint-disable-next-line require-yield
	mws.use(function * () {
		throw new Error('test-error');
	});

	// eslint-disable-next-line require-yield, no-unused-vars
	mws.use(function * (ctx, err, next) {
		ctx.ex = err;
	});

	const ctx = {};

	yield mws.run(ctx);

	return {mws, ctx};
});

test('register all mws', async t => {
	const ctx = await setupMws();
	t.is(ctx.mws.mws.length, 2);
});

test('can construct instance', async t => {
	const ctx = await setupMws();
	t.is(typeof ctx.mws, 'object');
});

test('execute all mws', async t => {
	const ctx = await setupMws();
	t.is(ctx.ctx.result, 'yet another hello world');
});

test('handle errors', async t => {
	const ctx = await setupErrorMws();
	t.is(ctx.ctx.ex.message, 'test-error');
});

test('allow function mw returning next', async t => {
	const ctx = {};
	const mws = new CoMws();

	mws.use(function (next) {
		this.result = 'hello';
		return next();
	});

	// eslint-disable-next-line require-yield
	mws.use(function * (next) {
		this.result += ' world';
		next();
	});

	await mws.run(ctx);

	t.is(ctx.result, 'hello world');
});

test('allow function mw returning a promise', async t => {
	const ctx = {};

	const mws = new CoMws();

	mws.use(function (next) {
		return new Promise(resolve => {
			next().then(() => {
				this.result += ' world';
				resolve();
			});
		});
	});

	// eslint-disable-next-line require-yield
	mws.use(function * (next) {
		this.result = 'hello';
		next();
	});

	await mws.run(ctx);
	t.is(ctx.result, 'hello world');
});

test('allow function mw returning a normal value', async t => {
	const ctx = {};
	const mws = new CoMws();

	mws.use(function * (next) {
		this.result = yield Promise.resolve('hello');
		yield next();
	});

	// eslint-disable-next-line require-yield, no-unused-vars
	mws.use(function (next) {
		this.result += ' world';
		return null;
	});

	await mws.run(ctx);
	t.is(ctx.result, 'hello world');
});

test('allow generators, arrow and normal function with ctx arg', async t => {
	const ctx = {};
	const mws = new CoMws();

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

	await mws.run(ctx);
	t.is(ctx.result, 'hello magic world');
});
