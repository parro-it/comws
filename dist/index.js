"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var co = _interopRequire(require("co"));

var isPromise = _interopRequire(require("is-promise"));

var PrettyError = _interopRequire(require("pretty-error"));

function isGenerator(fn) {

    return fn.constructor.name.endsWith("GeneratorFunction");
}

var CoMws = (function () {
    function CoMws() {
        _classCallCheck(this, CoMws);

        this.mws = [];
    }

    _createClass(CoMws, {
        use: {
            value: function use(mw) {
                this.mws.push(mw);
            }
        },
        handleError: {
            value: function handleError(ctx, err, mwIdx) {
                var idxErrMiddleware = mwIdx + 1;

                while (idxErrMiddleware < this.mws.length) {

                    var errMiddleware = this.mws[idxErrMiddleware];

                    if (errMiddleware.length === 3) {
                        var runner = co.wrap(errMiddleware);
                        return runner(ctx, err, function () {});
                    }

                    idxErrMiddleware++;
                }

                var pe = new PrettyError();
                var renderedError = pe.render(err);

                console.error(renderedError);
                return err;
            }
        },
        run: {
            value: function run(ctx) {
                var _this = this;

                var step = function (idx) {
                    if (idx === _this.mws.length) {
                        return Promise.resolve(true);
                    }

                    var currentMw = _this.mws[idx];

                    var next = function (err) {
                        if (err) {
                            return _this.handleError(ctx, err, idx);
                        }

                        var result = step(idx + 1);

                        if (isPromise(result)) {
                            return result;
                        } else {
                            return result instanceof Error ? Promise.reject(result) : Promise.resolve(result);
                        }
                    };

                    var runner = isGenerator(currentMw) ? co.wrap(currentMw) : currentMw;

                    var result = undefined;
                    try {

                        if (runner.length === 2) {
                            result = runner(ctx, next);
                        } else {
                            result = runner.call(ctx, next);
                        }
                    } catch (err) {
                        return next(err);
                    }

                    if (isPromise(result)) {

                        return result["catch"](next);
                    } else {

                        return result;
                    }
                };

                return step(0);
            }
        }
    });

    return CoMws;
})();

module.exports = CoMws;
