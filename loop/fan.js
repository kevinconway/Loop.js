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

    def.call(ctx, 'loop/fan', deps[env], function (defer, Deferred, helpers) {

        function fan() {

            var args = Array.prototype.slice.call(arguments),
                state = {
                    "offset": 0,
                    "size": args.length,
                    "deferred": new Deferred()
                },
                x;

            function complete() {

                state.offset = state.offset + 1;

                if (state.offset >= state.size) {

                    state.deferred.resolve();

                }

            }

            function next(fn) {

                var fnValue;

                try {

                    fnValue = fn();

                    if (fnValue &&
                            fnValue.callback &&
                            fnValue.errback) {

                        fnValue.callback(complete);
                        fnValue.errback(function (err) {
                            state.deferred.fail(err);
                            state.offset = state.size;
                        });

                        return;

                    }

                    complete();

                } catch (e) {

                    state.deferred.fail(e);
                    state.offset = state.size;

                }

            }

            for (x = 0; x < state.size; x = x + 1) {

                defer(helpers.apply(next, args[x]));

            }

            return state.deferred.promise();

        }

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
                },
                x,
                fnDeferred;

            if (state.size < 1) {

                state.deferred.resolve();

            }

            function complete() {

                state.offset = state.offset + 1;

                if (state.offset >= state.size) {

                    state.deferred.resolve();

                }

            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            for (x = 0; x < state.size; x = x + 1) {

                fnDeferred = execute(
                    helpers.apply(
                        fn,
                        list[x],
                        x,
                        list
                    )
                );
                fnDeferred.callback(complete);
                fnDeferred.errback(fail);

            }

            return state.deferred.promise();

        }

        function forIn(obj, fn) {

            var state = {
                    "keys": [],
                    "offset": 0,
                    "size": 0,
                    "deferred": new Deferred()
                },
                key,
                x,
                fnDeferred;

            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    state.keys.push(key);
                }
            }

            state.size = state.keys.length;

            if (state.size < 1) {

                state.deferred.resolve();

            }

            function complete() {

                state.offset = state.offset + 1;

                if (state.offset >= state.size) {

                    state.deferred.resolve();

                }

            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            for (x = 0; x < state.size; x = x + 1) {

                fnDeferred = execute(
                    helpers.apply(
                        fn,
                        obj[state.keys[x]],
                        state.keys[x],
                        obj
                    )
                );
                fnDeferred.callback(complete);
                fnDeferred.errback(fail);

            }

            return state.deferred.promise();

        }

        function forX(x, fn) {

            var state = {
                    "offset": 0,
                    "size": x,
                    "deferred": new Deferred()
                },
                y,
                fnDeferred;

            if (state.size < 1) {

                state.deferred.resolve();

            }

            function complete() {

                state.offset = state.offset + 1;

                if (state.offset >= state.size) {

                    state.deferred.resolve();

                }

            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            for (y = 0; y < state.size; y = y + 1) {

                fnDeferred = execute(helpers.apply(fn, y));
                fnDeferred.callback(complete);
                fnDeferred.errback(fail);

            }

            return state.deferred.promise();

        }

        function map(list, fn) {

            var state = {
                    "offset": 0,
                    "size": list.length,
                    "list": [],
                    "deferred": new Deferred()
                },
                x;

            if (state.size < 1) {

                state.deferred.resolve([]);

            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            function complete(func, x) {

                var testDeferred = execute(func);

                testDeferred.callback(function (value) {

                    state.offset = state.offset + 1;
                    state.list[x] = value;

                    if (state.offset >= state.size) {

                        state.deferred.resolve(state.list);

                    }

                });
                testDeferred.errback(fail);

            }

            for (x = 0; x < state.size; x = x + 1) {

                complete(helpers.apply(fn, list[x]), x);

            }

            return state.deferred.promise();

        }

        function select(list, test) {

            var state = {
                    "offset": 0,
                    "size": list.length,
                    "list": [],
                    "deferred": new Deferred()
                },
                x;

            if (state.size < 1) {

                state.deferred.resolve([]);

            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            function complete(test, x) {

                var testDeferred = execute(test);

                testDeferred.callback(function (testResults) {
                    if (testResults === true) {
                        state.list.push(list[x]);
                    }
                    state.offset = state.offset + 1;

                    if (state.offset >= state.size) {

                        state.deferred.resolve(state.list);

                    }

                });

                testDeferred.errback(fail);

            }

            for (x = 0; x < state.size; x = x + 1) {

                complete(helpers.apply(test, list[x]), x);

            }

            return state.deferred.promise();

        }

        function remove(list, test) {

            var state = {
                    "offset": 0,
                    "size": list.length,
                    "list": [],
                    "deferred": new Deferred()
                },
                x;

            if (state.size < 1) {

                state.deferred.resolve([]);

            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            function complete(test, x) {

                var testDeferred = execute(test);

                testDeferred.callback(function (testResults) {
                    if (testResults === false) {
                        state.list.push(list[x]);
                    }
                    state.offset = state.offset + 1;

                    if (state.offset >= state.size) {

                        state.deferred.resolve(state.list);

                    }

                });

                testDeferred.errback(fail);

            }

            for (x = 0; x < state.size; x = x + 1) {

                complete(helpers.apply(test, list[x]), x);

            }

            return state.deferred.promise();

        }

        function find(list, test) {

            var state = {
                    "offset": 0,
                    "size": list.length,
                    "deferred": new Deferred()
                },
                x;

            if (state.size < 1) {

                state.deferred.resolve([]);

            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            function complete(test, x) {

                var testDeferred = execute(test);

                testDeferred.callback(function (testResults) {
                    if (testResults === true) {
                        state.deferred.resolve(list[x]);
                        state.offset = state.size;
                        return;
                    }

                    state.offset = state.offset + 1;

                    if (state.offset >= state.size) {

                        state.deferred.resolve();

                    }

                });

                testDeferred.errback(fail);

            }

            for (x = 0; x < state.size; x = x + 1) {

                complete(helpers.apply(test, list[x]), x);

            }

            return state.deferred.promise();

        }

        function all(list, test) {

            var state = {
                    "offset": 0,
                    "size": list.length,
                    "deferred": new Deferred()
                },
                x;

            if (state.size < 1) {

                state.deferred.resolve([]);

            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            function complete(test, x) {

                var testDeferred = execute(test);

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

                });

                testDeferred.errback(fail);

            }

            for (x = 0; x < state.size; x = x + 1) {

                complete(helpers.apply(test, list[x]), x);

            }

            return state.deferred.promise();

        }

        function none(list, test) {

            var state = {
                    "offset": 0,
                    "size": list.length,
                    "deferred": new Deferred()
                },
                x;

            if (state.size < 1) {

                state.deferred.resolve([]);

            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            function complete(test, x) {

                var testDeferred = execute(test);

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

                });

                testDeferred.errback(fail);

            }

            for (x = 0; x < state.size; x = x + 1) {

                complete(helpers.apply(test, list[x]), x);

            }

            return state.deferred.promise();

        }

        function join(list, fn) {

            var state = {
                    "offset": 0,
                    "size": list.length,
                    "list": [],
                    "deferred": new Deferred()
                },
                x,
                fnDeferred;

            if (state.size < 1) {

                state.deferred.resolve([]);

            }

            function complete(value) {

                state.offset = state.offset + 1;
                state.list = state.list.concat(value);

                if (state.offset >= state.size) {

                    state.deferred.resolve(state.list);

                }

            }

            function fail(err) {
                state.offset = state.size;
                state.deferred.fail(err);
            }

            for (x = 0; x < state.size; x = x + 1) {

                fnDeferred = execute(helpers.apply(fn, list[x]));
                fnDeferred.callback(complete);
                fnDeferred.errback(fail);

            }

            return state.deferred.promise();

        }


        fan.fan = fan;
        fan.forEach = forEach;
        fan.forIn = forIn;
        fan.forX = forX;
        fan.map = map;
        fan.select = select;
        fan.remove = remove;
        fan.find = find;
        fan.all = all;
        fan.none = none;
        fan.join = join;


        return fan;

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

