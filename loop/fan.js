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

        /*
            Given any number of functions to run this method will queue all of
            these functions to be executed at the next available cycle. Unlike
            the sequential counterpart, this method does manage the order of
            execution for the given functions.

            This function returns a Deferred object.

            If any function causes throws an exception then the Deferred is
            failed with that exception. Only the first exception thrown is used
            even if multiple items fail. All given functions execute to
            completion/failure regardless.

            On completion of all functions the Deferred is resolved, but with no
            associated value.

            This method is Deferred aware and will use the resolve/fail status
            of the Deferred returned by a function as the resolve/fail status
            of the function.
        */
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

        /*
            The `fan` submodule contains counterparts to most of the methods
            in the `sequential` submodule. The only difference is functionality
            between the two is that the `fan` methods queue all actions at once
            rather that iterating through in sequence.

            This is potentially useful when working with large numbers of
            non-blocking actions.
        */
        (function (fan) {

            function forX(x, fn) {

                var state = {
                        "offset": 0,
                        "size": x,
                        "deferred": new Deferred()
                    },
                    y;

                if (state.size < 1) {

                    state.deferred.resolve();

                }

                function complete() {

                    state.offset = state.offset + 1;

                    if (state.offset >= state.size) {

                        state.deferred.resolve();

                    }

                }

                function next(val) {

                    var fnValue;

                    try {

                        fnValue = fn(val);

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

                for (y = 0; y < state.size; y = y + 1) {

                    defer(helpers.apply(next, y));

                }

                return state.deferred.promise();

            }

            function forEach(list, fn) {

                var state = {
                        "offset": 0,
                        "size": list.length,
                        "deferred": new Deferred()
                    },
                    x;

                if (state.size < 1) {

                    state.deferred.resolve();

                }

                function complete() {

                    state.offset = state.offset + 1;

                    if (state.offset >= state.size) {

                        state.deferred.resolve();

                    }

                }

                function next(val) {

                    var fnValue;

                    try {

                        fnValue = fn(val);

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

                    defer(helpers.apply(next, list[x]));

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

                function complete() {

                    state.offset = state.offset + 1;

                    if (state.offset >= state.size) {

                        state.deferred.resolve();

                    }

                }

                function next(key) {

                    var fnValue;

                    try {

                        fnValue = fn(obj[key]);

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

                    defer(helpers.apply(next, state.keys[x]));

                }

                return state.deferred.promise();

            }

            function map(list, fn) {

                var state = {
                    "complete": 0,
                    "size": list.length,
                    "list": [],
                    "deferred": new Deferred()
                },
                    x;

                if (state.size < 1) {

                    state.deferred.resolve([]);

                }

                function complete() {

                    state.complete = state.complete + 1;

                    if (state.complete >= state.size) {

                        state.deferred.resolve(state.list);

                    }

                }

                function next(offset) {

                    var fnValue;

                    if (state.offset > (state.size - 1)) {

                        state.deferred.resolve(state.list);
                        return;

                    }

                    try {

                        fnValue = fn(list[offset]);

                        if (fnValue &&
                                fnValue.callback &&
                                fnValue.errback) {

                            fnValue.callback(function (val) {
                                state.list[offset] = val;
                                complete();
                            });
                            fnValue.errback(function (err) {
                                state.deferred.fail(err);
                                state.complete = state.size;
                            });

                            return;

                        }

                        state.list[offset] = fnValue;
                        complete();

                    } catch (e) {

                        state.deferred.fail(e);
                        state.offset = state.size;
                        return;

                    }

                }

                for (x = 0; x < state.size; x = x + 1) {

                    defer(helpers.apply(next, x));

                }

                return state.deferred.promise();

            }

            fan.forX = forX;
            fan.forEach = forEach;
            fan.forIn = forIn;
            fan.map = map;

        }(fan));

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

