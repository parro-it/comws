'use strict';

const co = require('co');
const isPromise = require('is-promise');
const PrettyError = require('pretty-error');

const pe = new PrettyError();
const debug = require('debug')('comws');

function isGenerator(fn) {
	return fn.constructor.name.endsWith('GeneratorFunction');
}

module.exports = class CoMws {
	constructor() {
		this.mws = [];
	}

	use(mw) {
		if (arguments.length === 1) {
			this.mws.push(mw);
		} else {
			this.mws.push.apply(this.mws, Array.from(arguments));
		}
		return this;
	}

	handleError(ctx, err, mwIdx) {
		let idxErrMiddleware = mwIdx + 1;

		while (idxErrMiddleware < this.mws.length) {
			const errMiddleware = this.mws[idxErrMiddleware];

			if (errMiddleware.length === 3) {
				const runner = co.wrap(errMiddleware);
				return runner(ctx, err, () => {});
			}

			idxErrMiddleware++;
		}

		const renderedError = pe.render(err);

		process.stderr.write(renderedError.stack + '\n');
		return err;
	}

	run(ctx) {
		const step = idx => {
			if (idx === this.mws.length) {
				return Promise.resolve(true);
			}

			const currentMw = this.mws[idx];

			const next = err => {
				if (err) {
					return this.handleError(ctx, err, idx);
				}

				const result = step(idx + 1);

				if (isPromise(result)) {
					return result;
				}

				return result instanceof Error ?
					Promise.reject(result) :
					Promise.resolve(result);
			};

			const runner = isGenerator(currentMw) ?
				co.wrap(currentMw) :
				currentMw;

			debug(`running ${currentMw.name || 'anonymous middleware'} idetified as ${isGenerator(currentMw) ? 'generator' : 'normal function'}`);

			let result;

			try {
				debug(`running ${currentMw.name || 'anonymous middleware'} with context`);

				if (runner.length === 2) {
					debug(`running ${currentMw.name || 'anonymous middleware'} with context as argument`);
					result = runner(ctx, next);
				} else {
					debug(`running ${currentMw.name || 'anonymous middleware'} with context binded to this`);
					result = runner.call(ctx, next);
				}
			} catch (err) {
				debug(`${currentMw.name || 'anonymous middleware'} throws ${err}`);

				return next(err);
			}

			if (isPromise(result)) {
				return result
					.then(res => {
						debug(`${currentMw.name || 'anonymous middleware'} resolved to ${res}`);

						return res;
					})
					.catch(err => {
						debug(`${currentMw.name || 'anonymous middleware'} rejected with ${err}`);

						return next(err);
					});
			}

			debug(`${currentMw.name || 'anonymous middleware'} return ${result}`);

			return Promise.resolve(result);
		};

		return step(0);
	}
};
