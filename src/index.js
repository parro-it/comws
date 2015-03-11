'use strict';

import co from 'co';
import isPromise from 'is-promise';
//import PrettyError from 'pretty-error';

function isGenerator(fn) {

    return fn.constructor.name.endsWith('GeneratorFunction');
}

export default class CoMws {
    constructor() {
        this.mws = [];
    }

    use(mw) {
        this.mws.push(mw);

    }

    handleError(ctx, err, mwIdx) {
        let idxErrMiddleware = mwIdx + 1;

        while (idxErrMiddleware < this.mws.length) {

            let errMiddleware = this.mws[idxErrMiddleware];

            if (errMiddleware.length === 3) {
                const runner = co.wrap(errMiddleware);
                return runner(ctx, err, () => {});
            }

            idxErrMiddleware++;

        } 

        //var pe = new PrettyError();
        //var renderedError = pe.render(new Error('Some error message'));

        console.error(err.stack);
        return err;

    }

    run(ctx) {

        const step = (idx) => {
            if (idx === this.mws.length) {
                return Promise.resolve(true);
            }


            const currentMw = this.mws[idx];

            const next = (err) => {
                if (err) {
                    return this.handleError(ctx, err, idx);
                }

                let result = step(idx + 1);

                if (isPromise(result)) {
                	return result;	
                }  else {
                	return result instanceof Error ? Promise.reject(result) : Promise.resolve(result);
                }
            };

            const runner = isGenerator(currentMw) ? co.wrap(currentMw) : currentMw;


            try {

                if (runner.length === 2) {
                    return runner(ctx, next);

                } else {
                    return runner.call(ctx, next);

                }

            } catch (err) {
                console.log(err.stack);
                return next(err);

            }

        };

        return step(0);

    }
}
