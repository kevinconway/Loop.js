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

    def.call(ctx, 'loop/batch', deps[env], function (defer, Deferred, helpers) {


        function forEach(list, fn, limit) {

            var state = {
                    "offset": 0,
                    "size": list.length,
                    "limit": limit || 1,
                    "deferred": new Deferred()
                },
                x;

            if (state.size < 1) {

                state.deferred.resolve();

            }

            if (state.limit > state.size) {
                state.limit = state.size;
            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            function complete(func, n) {

                var fnDeferred = helpers.execute(func);

                fnDeferred.callback(function (value) {

                    state.offset = state.offset + 1;

                    if (state.offset >= state.size) {

                        state.deferred.resolve();

                    }

                    if (n + state.limit < state.size) {

                        complete(
                            helpers.apply(
                                fn,
                                list[n + state.limit],
                                n + state.limit,
                                list
                            ),
                            x
                        );

                    }

                });

                fnDeferred.errback(fail);

            }

            for (x = 0; x < state.limit; x = x + 1) {

                complete(
                    helpers.apply(
                        fn,
                        list[x],
                        x,
                        list
                    ),
                    x
                );

            }

            return state.deferred.promise();

        }

        function forIn(obj, fn, limit) {

            var state = {
                    "keys": [],
                    "offset": 0,
                    "size": 0,
                    "limit": limit || 1,
                    "deferred": new Deferred()
                },
                key,
                x;

            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    state.keys.push(key);
                }
            }

            state.size = state.keys.length;

            if (state.size < 1) {

                state.deferred.resolve();

            }

            if (state.limit > state.size) {
                state.limit = state.size;
            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            function complete(func, n) {

                var fnDeferred = helpers.execute(func);

                fnDeferred.callback(function (value) {

                    state.offset = state.offset + 1;

                    if (state.offset >= state.size) {

                        state.deferred.resolve();

                    }

                    if (n + state.limit < state.size) {

                        complete(
                            helpers.apply(
                                fn,
                                obj[state.keys[n + state.limit]],
                                state.keys[n + state.limit],
                                obj
                            ),
                            n + state.limit
                        );

                    }

                });

                fnDeferred.errback(fail);

            }

            for (x = 0; x < state.limit; x = x + 1) {

                complete(
                    helpers.apply(
                        fn,
                        obj[state.keys[x]],
                        state.keys[x],
                        obj
                    ),
                    x
                );

            }

            return state.deferred.promise();

        }

        function forX(x, fn, limit) {

            var state = {
                    "offset": 0,
                    "size": x,
                    "limit": limit || 1,
                    "deferred": new Deferred()
                },
                y;

            if (state.size < 1) {

                state.deferred.resolve();

            }

            if (state.limit > state.size) {
                state.limit = state.size;
            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            function complete(func, n) {

                var fnDeferred = helpers.execute(func);

                fnDeferred.callback(function (value) {

                    state.offset = state.offset + 1;

                    if (state.offset >= state.size) {

                        state.deferred.resolve();

                    }

                    if (n + state.limit < state.size) {

                        complete(
                            helpers.apply(
                                fn,
                                n + state.limit
                            ),
                            n + state.limit
                        );

                    }

                });


            }

            for (y = 0; y < state.limit; y = y + 1) {

                complete(helpers.apply(fn, y), y);

            }

            return state.deferred.promise();

        }

        function map(list, fn, limit) {

            var state = {
                    "offset": 0,
                    "size": list.length,
                    "limit": limit || 1,
                    "list": [],
                    "deferred": new Deferred()
                },
                x;

            if (state.size < 1) {

                state.deferred.resolve([]);

            }

            if (state.limit > state.size) {
                state.limit = state.size;
            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            function complete(func, n) {

                var fnDeferred = helpers.execute(func);

                fnDeferred.callback(function (value) {

                    state.offset = state.offset + 1;
                    state.list[n] = value;

                    if (state.offset >= state.size) {

                        state.deferred.resolve(state.list);

                    }

                    if (n + state.limit < state.size) {

                        complete(
                            helpers.apply(
                                fn,
                                list[n + state.limit]
                            ),
                            n + state.limit
                        );

                    }

                });

                fnDeferred.errback(fail);

            }

            for (x = 0; x < state.limit; x = x + 1) {

                complete(helpers.apply(fn, list[x]), x);

            }

            return state.deferred.promise();

        }

        function select(list, test, limit) {

            var state = {
                    "offset": 0,
                    "size": list.length,
                    "limit": limit || 1,
                    "list": [],
                    "deferred": new Deferred()
                },
                x;

            if (state.size < 1) {

                state.deferred.resolve([]);

            }

            if (state.limit > state.size) {
                state.limit = state.size;
            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            function complete(testFunc, n) {

                var testDeferred = helpers.execute(testFunc);

                testDeferred.callback(function (testResults) {

                    if (testResults === true) {
                        state.list.push(list[n]);
                    }
                    state.offset = state.offset + 1;

                    if (state.offset >= state.size) {

                        state.deferred.resolve(state.list);

                    }

                    if (n + state.limit < state.size) {
                        complete(
                            helpers.apply(
                                test,
                                list[n + state.limit]
                            ),
                            n + state.limit
                        );

                    }

                });

                testDeferred.errback(fail);

            }

            for (x = 0; x < state.limit; x = x + 1) {

                complete(helpers.apply(test, list[x]), x);

            }

            return state.deferred.promise();

        }

        function remove(list, test, limit) {

            var state = {
                    "offset": 0,
                    "size": list.length,
                    "limit": limit || 1,
                    "list": [],
                    "deferred": new Deferred()
                },
                x;

            if (state.size < 1) {

                state.deferred.resolve([]);

            }

            if (state.limit > state.size) {
                state.limit = state.size;
            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            function complete(testFunc, n) {

                var testDeferred = helpers.execute(testFunc);

                testDeferred.callback(function (testResults) {

                    if (testResults === false) {
                        state.list.push(list[n]);
                    }
                    state.offset = state.offset + 1;

                    if (state.offset >= state.size) {

                        state.deferred.resolve(state.list);

                    }

                    if (n + state.limit < state.size) {
                        complete(
                            helpers.apply(
                                test,
                                list[n + state.limit]
                            ),
                            n + state.limit
                        );

                    }

                });

                testDeferred.errback(fail);

            }

            for (x = 0; x < state.limit; x = x + 1) {

                complete(helpers.apply(test, list[x]), x);

            }

            return state.deferred.promise();

        }

        function find(list, test, limit) {

            var state = {
                    "offset": 0,
                    "size": list.length,
                    "limit": limit || 1,
                    "deferred": new Deferred()
                },
                x;

            if (state.size < 1) {

                state.deferred.resolve([]);

            }

            if (state.limit > state.size) {
                state.limit = state.size;
            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            function complete(testFunc, n) {

                var testDeferred = helpers.execute(testFunc);

                testDeferred.callback(function (testResults) {
                    if (testResults === true) {
                        state.deferred.resolve(list[n]);
                        state.offset = state.size;
                        return;
                    }

                    state.offset = state.offset + 1;

                    if (state.offset >= state.size) {

                        state.deferred.resolve();

                    }

                    if (n + state.limit < state.size) {

                        complete(
                            helpers.apply(
                                test,
                                list[n + state.limit]
                            ),
                            n + state.limit
                        );

                    }

                });

                testDeferred.errback(fail);

            }

            for (x = 0; x < state.limit; x = x + 1) {

                complete(helpers.apply(test, list[x]), x);

            }

            return state.deferred.promise();

        }

        function all(list, test, limit) {

            var state = {
                    "offset": 0,
                    "size": list.length,
                    "limit": limit || 1,
                    "deferred": new Deferred()
                },
                x;

            if (state.size < 1) {

                state.deferred.resolve([]);

            }

            if (state.limit > state.size) {
                state.limit = state.size;
            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            function complete(testFunc, n) {

                var testDeferred = helpers.execute(testFunc);

                testDeferred.callback(function (testResults) {
                    if (testResults === false) {
                        state.deferred.resolve(false);
                        state.offset = state.size;
                        return;
                    }

                    state.offset = state.offset + 1;

                    if (state.offset >= state.size) {

                        state.deferred.resolve(true);

                    }

                    if (n + state.limit < state.size) {

                        complete(
                            helpers.apply(
                                test,
                                list[n + state.limit]
                            ),
                            n + state.limit
                        );

                    }

                });

                testDeferred.errback(fail);

            }

            for (x = 0; x < state.limit; x = x + 1) {

                complete(helpers.apply(test, list[x]), x);

            }

            return state.deferred.promise();

        }

        function none(list, test, limit) {

            var state = {
                    "offset": 0,
                    "size": list.length,
                    "limit": limit || 1,
                    "deferred": new Deferred()
                },
                x;

            if (state.size < 1) {

                state.deferred.resolve([]);

            }

            if (state.limit > state.size) {
                state.limit = state.size;
            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            function complete(testFunc, n) {

                var testDeferred = helpers.execute(testFunc);

                testDeferred.callback(function (testResults) {
                    if (testResults === true) {
                        state.deferred.resolve(false);
                        state.offset = state.size;
                        return;
                    }

                    state.offset = state.offset + 1;

                    if (state.offset >= state.size) {

                        state.deferred.resolve(true);

                    }

                    if (n + state.limit < state.size) {

                        complete(
                            helpers.apply(
                                test,
                                list[n + state.limit]
                            ),
                            n + state.limit
                        );

                    }

                });

                testDeferred.errback(fail);

            }

            for (x = 0; x < state.limit; x = x + 1) {

                complete(helpers.apply(test, list[x]), x);

            }

            return state.deferred.promise();

        }

        function join(list, fn, limit) {

            var state = {
                    "offset": 0,
                    "size": list.length,
                    "limit": limit || 1,
                    "list": [],
                    "deferred": new Deferred()
                },
                x,
                fnDeferred;

            if (state.size < 1) {

                state.deferred.resolve([]);

            }

            if (state.limit > state.size) {
                state.limit = state.size;
            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            function complete(func, n) {

                var fnDeferred = helpers.execute(func);

                fnDeferred.callback(function (value) {

                    state.offset = state.offset + 1;
                    state.list = state.list.concat(value);

                    if (state.offset >= state.size) {

                        state.deferred.resolve(state.list);

                    }

                    if (n + state.limit < state.size) {

                        complete(
                            helpers.apply(
                                fn,
                                list[n + state.limit]
                            ),
                            n + state.limit
                        );

                    }

                });

            }

            for (x = 0; x < state.limit; x = x + 1) {

                complete(helpers.apply(fn, list[x]), x);

            }

            return state.deferred.promise();

        }

        function batch() {

            var args = Array.prototype.slice.call(arguments),
                state = {
                    "offset": 0,
                    "size": args.length,
                    "limit": 1,
                    "deferred": new Deferred()
                },
                x;

            if (typeof args[args.length - 1] === 'Number') {
                state.limit = args.pop() || 1;
            }

            if (state.limit > state.size) {
                state.limit = state.size;
            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            function complete(func, n) {

                var fnDeferred = helpers.execute(func);

                fnDeferred.callback(function (value) {

                    state.offset = state.offset + 1;

                    if (state.offset >= state.size) {

                        state.deferred.resolve();

                    }

                    if (n + state.limit < state.size) {
                        complete(args[n + state.limit], n + state.limit);
                    }

                });

                fnDeferred.errback(fail);

            }

            for (x = 0; x < state.limit; x = x + 1) {

                complete(args[x], x);

            }

            return state.deferred.promise();

        }


        batch.batch = batch;
        batch.forEach = forEach;
        batch.forIn = forIn;
        batch.forX = forX;
        batch.map = map;
        batch.select = select;
        batch.remove = remove;
        batch.find = find;
        batch.all = all;
        batch.none = none;
        batch.join = join;


        return batch;

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

