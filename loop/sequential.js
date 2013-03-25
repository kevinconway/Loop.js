/*
The MIT License (MIT)
Copyright (c) 2013 Kevin Conway

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*global require, define, module

*/
(function (ctx, factory) {
    "use strict";

    var env = factory.env,
        def = factory.def,
        deps = {
            amd: ['../node_modules/deferjs/defer.js', '../node_modules/deferredjs/deferred.js', './helpers.js'],
            node: ['deferjs', 'deferredjs', './helpers'],
            browser: ['defer', 'Deferred', 'loop/helpers']
        };

    def.call(ctx, 'loop/sequential', deps[env], function (defer, Deferred, helpers) {

        function execute(fn) {

            var d, fnDeferred;

            function resolve() {

                try {

                    fnDeferred = fn();

                    if (fnDeferred &&
                            fnDeferred.callback &&
                            fnDeferred.errback) {

                        fnDeferred.callback(function (value) {
                            d.resolve(value);
                        });
                        fnDeferred.errback(function (err) {
                            d.fail(err);
                        });

                        return;

                    }

                    d.resolve(fnDeferred);

                } catch (e) {

                    d.fail(e);
                    return;

                }

            }

            d = new Deferred();

            defer(resolve);

            return d.promise();

        }

        function forEach(list, fn) {

            var state = {
                "offset": 0,
                "size": list.length,
                "deferred": new Deferred()
            };

            function next() {

                var fnDeferred;

                if (state.offset > (state.size - 1)) {

                    state.deferred.resolve();
                    return;

                }

                fnDeferred = execute(
                    helpers.apply(
                        fn,
                        list[state.offset],
                        state.offset,
                        list
                    )
                );

                fnDeferred.callback(function () {
                    state.offset = state.offset + 1;
                    defer(next);
                });

                fnDeferred.errback(function (err) {
                    state.deferred.fail(err);
                    state.offset = state.size;
                });

            }

            defer(next);
            return state.deferred.promise();

        }

        function forIn(obj, fn) {

            var state = {
                "keys": [],
                "offset": 0,
                "size": 0,
                "deferred": new Deferred()
            },
                key;

            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    state.keys.push(key);
                }
            }

            state.size = state.keys.length;

            function next() {

                var fnDeferred;

                if (state.offset > (state.size - 1)) {

                    state.deferred.resolve();
                    return;

                }

                fnDeferred = execute(
                    helpers.apply(
                        fn,
                        obj[state.keys[state.offset]],
                        state.keys[state.offset],
                        obj
                    )
                );

                fnDeferred.callback(function () {
                    state.offset = state.offset + 1;
                    defer(next);
                });

                fnDeferred.errback(function (err) {
                    state.deferred.fail(err);
                    state.offset = state.size;
                });

            }

            defer(next);
            return state.deferred.promise();

        }

        function forX(x, fn) {

            var state = {
                "offset": 0,
                "size": x,
                "deferred": new Deferred()
            };

            function next() {

                var fnDeferred;

                if (state.offset >= state.size) {

                    state.deferred.resolve();
                    return;

                }

                fnDeferred = execute(helpers.apply(fn, state.offset));

                fnDeferred.callback(function () {
                    state.offset = state.offset + 1;
                    defer(next);
                });

                fnDeferred.errback(function (err) {
                    state.deferred.fail(err);
                    state.offset = state.size;
                });

            }

            defer(next);
            return state.deferred.promise();

        }

        function untilFalse(test, fn) {

            var d = new Deferred();

            function next() {

                var testDeferred;

                testDeferred = execute(test);

                testDeferred.callback(function (testResult) {

                    var fnDeferred;

                    if (testResult === true) {

                        fnDeferred = execute(fn);

                        fnDeferred.callback(next);

                        fnDeferred.errback(function (err) {

                            d.fail(err);

                        });
                        return;
                    }

                    d.resolve();

                });

                testDeferred.errback(function (err) {

                    d.fail(err);

                });

            }

            defer(next);

            return d.promise();

        }

        function doUntilFalse(test, fn) {

            var d = new Deferred();

            function next() {

                var fnDeferred;

                fnDeferred = execute(fn);

                fnDeferred.callback(function () {

                    var testDeferred;

                    testDeferred = execute(test);

                    testDeferred.callback(function (testResult) {

                        if (testResult === true) {

                            defer(next);
                            return;
                        }

                        d.resolve();

                    });

                    testDeferred.errback(function (err) {

                        d.fail(err);

                    });

                });

                fnDeferred.errback(function (err) {

                    d.fail(err);

                });


            }

            defer(next);

            return d.promise();

        }

        function untilTrue(test, fn) {

            var d = new Deferred();

            function next() {

                var testDeferred;

                testDeferred = execute(test);

                testDeferred.callback(function (testResult) {

                    var fnDeferred;

                    if (testResult === false) {

                        fnDeferred = execute(fn);

                        fnDeferred.callback(next);

                        fnDeferred.errback(function (err) {

                            d.fail(err);

                        });
                        return;
                    }

                    d.resolve();

                });

                testDeferred.errback(function (err) {

                    d.fail(err);

                });

            }

            defer(next);

            return d.promise();

        }

        function doUntilTrue(test, fn) {

            var d = new Deferred();

            function next() {

                var fnDeferred;

                fnDeferred = execute(fn);

                fnDeferred.callback(function () {

                    var testDeferred;

                    testDeferred = execute(test);

                    testDeferred.callback(function (testResult) {

                        if (testResult === false) {

                            defer(next);
                            return;
                        }

                        d.resolve();

                    });

                    testDeferred.errback(function (err) {

                        d.fail(err);

                    });

                });

                fnDeferred.errback(function (err) {

                    d.fail(err);

                });


            }

            defer(next);

            return d.promise();

        }

        function map(list, fn) {

            var state = {
                "offset": 0,
                "size": list.length,
                "list": [],
                "deferred": new Deferred()
            };

            function next() {

                var fnDeferred;

                if (state.offset > (state.size - 1)) {

                    state.deferred.resolve(state.list);
                    return;

                }

                fnDeferred = execute(helpers.apply(fn, list[state.offset]));

                fnDeferred.callback(function (val) {
                    state.list[state.offset] = val;
                    state.offset = state.offset + 1;
                    defer(next);
                });
                fnDeferred.errback(function (err) {
                    state.deferred.fail(err);
                    state.offset = state.size;
                });

            }

            defer(next);
            return state.deferred.promise();

        }

        function reduce(list, fn, val) {

            var state = {
                "offset": 0,
                "size": list.length,
                "val": val,
                "deferred": new Deferred()
            };

            function next() {

                var fnDeferred;

                if (state.offset > (state.size - 1)) {

                    state.deferred.resolve(state.val);
                    return;

                }

                fnDeferred = execute(
                    helpers.apply(
                        fn,
                        list[state.offset],
                        state.val
                    )
                );

                fnDeferred.callback(function (val) {
                    state.val = val;
                    state.offset = state.offset + 1;
                    defer(next);
                });
                fnDeferred.errback(function (err) {
                    state.deferred.fail(err);
                    state.offset = state.size;
                });

            }

            defer(next);
            return state.deferred.promise();

        }

        function select(list, test) {

            var state = {
                "offset": 0,
                "size": list.length,
                "list": [],
                "deferred": new Deferred()
            };

            function next() {

                var fnDeferred;

                if (state.offset > (state.size - 1)) {

                    state.deferred.resolve(state.list);
                    return;

                }

                fnDeferred = execute(helpers.apply(test, list[state.offset]));

                fnDeferred.callback(function (val) {
                    if (val === true) {
                        state.list.push(list[state.offset]);
                    }
                    state.offset = state.offset + 1;
                    defer(next);
                });
                fnDeferred.errback(function (err) {
                    state.deferred.fail(err);
                    state.offset = state.size;
                });

            }

            defer(next);
            return state.deferred.promise();

        }

        function remove(list, test) {

            var state = {
                "offset": 0,
                "size": list.length,
                "list": [],
                "deferred": new Deferred()
            };

            function next() {

                var fnDeferred;

                if (state.offset > (state.size - 1)) {

                    state.deferred.resolve(state.list);
                    return;

                }

                fnDeferred = execute(helpers.apply(test, list[state.offset]));

                fnDeferred.callback(function (val) {
                    if (val === false) {
                        state.list.push(list[state.offset]);
                    }
                    state.offset = state.offset + 1;
                    defer(next);
                });
                fnDeferred.errback(function (err) {
                    state.deferred.fail(err);
                    state.offset = state.size;
                });

            }

            defer(next);
            return state.deferred.promise();

        }

        function find(list, test) {

            var state = {
                "offset": 0,
                "size": list.length,
                "deferred": new Deferred()
            };

            function next() {

                var fnDeferred;

                if (state.offset > (state.size - 1)) {

                    state.deferred.resolve();
                    return;

                }

                fnDeferred = execute(helpers.apply(test, list[state.offset]));

                fnDeferred.callback(function (val) {
                    if (val === true) {
                        state.deferred.resolve(list[state.offset]);
                        state.offset = state.size;
                        return;
                    }
                    state.offset = state.offset + 1;
                    defer(next);
                });
                fnDeferred.errback(function (err) {
                    state.deferred.fail(err);
                    state.offset = state.size;
                });

            }

            defer(next);
            return state.deferred.promise();

        }

        function all(list, test) {

            var state = {
                "offset": 0,
                "size": list.length,
                "deferred": new Deferred()
            };

            function next() {

                var fnDeferred;

                if (state.offset > (state.size - 1)) {

                    state.deferred.resolve(true);
                    return;

                }

                fnDeferred = execute(helpers.apply(test, list[state.offset]));

                fnDeferred.callback(function (val) {
                    if (val === false) {
                        state.deferred.resolve(false);
                        state.offset = state.size;
                        return;
                    }
                    state.offset = state.offset + 1;
                    defer(next);
                });
                fnDeferred.errback(function (err) {
                    state.deferred.fail(err);
                    state.offset = state.size;
                });

            }

            defer(next);
            return state.deferred.promise();

        }

        function none(list, test) {

            var state = {
                "offset": 0,
                "size": list.length,
                "deferred": new Deferred()
            };

            function next() {

                var fnDeferred;

                if (state.offset > (state.size - 1)) {

                    state.deferred.resolve(true);
                    return;

                }

                fnDeferred = execute(helpers.apply(test, list[state.offset]));

                fnDeferred.callback(function (val) {
                    if (val === true) {
                        state.deferred.resolve(false);
                        state.offset = state.size;
                        return;
                    }
                    state.offset = state.offset + 1;
                    defer(next);
                });
                fnDeferred.errback(function (err) {
                    state.deferred.fail(err);
                    state.offset = state.size;
                });

            }

            defer(next);
            return state.deferred.promise();

        }

        function join(list, fn) {

            var state = {
                "offset": 0,
                "size": list.length,
                "list": [],
                "deferred": new Deferred()
            };

            function next() {

                var fnDeferred;

                if (state.offset > (state.size - 1)) {

                    state.deferred.resolve(state.list);
                    return;

                }

                fnDeferred = execute(helpers.apply(fn, list[state.offset]));

                fnDeferred.callback(function (val) {
                    state.list = state.list.concat(val);
                    state.offset = state.offset + 1;
                    defer(next);
                });
                fnDeferred.errback(function (err) {
                    state.deferred.fail(err);
                    state.offset = state.size;
                });

            }

            defer(next);
            return state.deferred.promise();

        }

        function sequential() {

            var args = Array.prototype.slice.call(arguments),
                state = {
                    "offset": 0,
                    "size": args.length,
                    "deferred": new Deferred()
                };

            function next() {

                var fnDeferred;

                if (state.offset > (state.size - 1)) {

                    state.deferred.resolve();
                    return;

                }

                fnDeferred = execute(args[state.offset]);

                fnDeferred.callback(function () {
                    state.offset = state.offset + 1;
                    defer(next);
                });
                fnDeferred.errback(function (err) {
                    state.deferred.fail(err);
                    state.offset = state.size;
                });

            }

            defer(next);
            return state.deferred.promise();

        }

        function chain() {

            var list = Array.prototype.slice.call(arguments),
                state = {
                    "offset": 0,
                    "size": list.length,
                    "deferred": new Deferred()
                };

            function next(value) {

                var fnDeferred;

                if (state.offset > (state.size - 1)) {

                    state.deferred.resolve(value);
                    return;

                }

                fnDeferred = execute(helpers.apply(list[state.offset], value));

                fnDeferred.callback(function (val) {
                    state.offset = state.offset + 1;
                    defer(helpers.apply(next, val));
                });
                fnDeferred.errback(function (err) {
                    state.deferred.fail(err);
                    state.offset = state.size;
                });

            }

            defer(next);
            return state.deferred.promise();

        }


        sequential.sequential = sequential;
        sequential.forEach = forEach;
        sequential.forIn = forIn;
        sequential.forX = forX;
        sequential.untilFalse = untilFalse;
        sequential.doUntilFalse = doUntilFalse;
        sequential.untilTrue = untilTrue;
        sequential.doUntilTrue = doUntilTrue;
        sequential.map = map;
        sequential.reduce = reduce;
        sequential.select = select;
        sequential.remove = remove;
        sequential.find = find;
        sequential.all = all;
        sequential.none = none;
        sequential.join = join;
        sequential.chain = chain;


        return sequential;

    });

}(this, (function (ctx) {
    "use strict";

    var currentEnvironment,
        generator;

    // Check the environment to determine the dependency management strategy.

    if (typeof define === "function" && !!define.amd) {

        currentEnvironment = 'amd';

    } else if (typeof require === "function" &&
                        module !== undefined && !!module.exports) {

        currentEnvironment = 'node';

    } else if (ctx.window !== undefined) {

        currentEnvironment = 'browser';

    }

    generator = (function () {
        switch (currentEnvironment) {

        case 'amd':

            // If RequireJS is used to load this module then return the global
            // define() function.
            return function (name, deps, mod) {
                define(deps, mod);
            };

        case 'node':

            // If this module is loaded in Node, require each of the
            // dependencies and pass them along.
            return function (name, deps, mod) {

                var x,
                    dep_list = [];

                for (x = 0; x < deps.length; x = x + 1) {

                    dep_list.push(require(deps[x]));

                }

                module.exports = mod.apply(this, dep_list);

            };

        case 'browser':

            // If this module is being used in a browser environment first
            // generate a list of dependencies, run the provided definition
            // function with the list of dependencies, and insert the returned
            // object into the global namespace using the provided module name.
            return function (name, deps, mod) {

                var namespaces = name.split('/'),
                    root = this,
                    dep_list = [],
                    current_scope,
                    current_dep,
                    i,
                    x;

                for (i = 0; i < deps.length; i = i + 1) {

                    current_scope = root;
                    current_dep = deps[i].split('/');

                    for (x = 0; x < current_dep.length; x = x + 1) {

                        current_scope = current_scope[current_dep[x]] || {};

                    }

                    dep_list.push(current_scope);

                }

                current_scope = root;
                for (i = 1; i < namespaces.length; i = i + 1) {

                    current_scope = current_scope[namespaces[i - 1]] || {};

                }

                current_scope[namespaces[i - 1]] = mod.apply(this, dep_list);

            };

        default:
            throw new Error("Unrecognized environment.");

        }

    }());


    return {
        env: currentEnvironment,
        def: generator
    };

}(this))));

