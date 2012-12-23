/*
The MIT License (MIT)
Copyright (c) 2012 Kevin Conway

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
            amd: ['./node_modules/deferjs/defer.js', './node_modules/deferredjs/deferred.js'],
            node: ['deferjs', 'deferredjs'],
            browser: ['defer', 'Deferred']
        };

    def.call(ctx, 'loop', deps[env], function (defer, Deferred) {

        /*
            This is a helper function to easy the process of binding
            deferred functions to their parameters.
        */
        function apply() {

            var args = Array.prototype.slice.call(arguments),
                fn = args.shift();

            return function () {

                return fn.apply({}, args);

            };

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

                try {

                    fnDeferred = args[state.offset]();

                    if (fnDeferred &&
                            fnDeferred.isInstance &&
                            fnDeferred.isInstance(Deferred)) {

                        fnDeferred.callback(next);
                        fnDeferred.errback(function (err) {
                            state.deferred.fail(err);
                            state.offset = state.size;
                        });

                        return;

                    }

                    state.offset = state.offset + 1;
                    defer(next);

                } catch (e) {

                    state.deferred.fail(e);
                    state.offset = state.size;
                    return;

                }

            }

            defer(next);
            return state.deferred.promise();

        }

        (function (sequential) {

            /*
                Given a list of things and some action, this function will apply
                the action to each item in the list.

                This function returns a Deferred object.

                If any item in the list causes the given action to throw an
                exception, the Deferred object will be failed with the same
                error that caused the initial exception. Only the first exception
                will be thrown. Once an error is thrown the loop stops and no more
                items are processed.

                If the action given to this function returns a Deferred object
                then the loop will wait until that deferred has been resolved
                before continuing on.
            */
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

                    try {

                        fnDeferred = fn(list[state.offset]);

                        if (fnDeferred &&
                                fnDeferred.isInstance &&
                                fnDeferred.isInstance(Deferred)) {

                            fnDeferred.callback(next);
                            fnDeferred.errback(function (err) {
                                state.deferred.fail(err);
                                state.offset = state.size;
                            });

                            return;

                        }

                        state.offset = state.offset + 1;
                        defer(next);

                    } catch (e) {

                        state.deferred.fail(e);
                        state.offset = state.size;
                        return;

                    }

                }

                defer(next);
                return state.deferred.promise();

            }

            /*
                Given some object and some action, this function will perform
                the action on each property of the object.

                Properties of the object a enumerated using a for in loop that is
                filtered by hasOwnProperty.

                This function returns a Deferred object.

                If the given action throws an exception at any point during the
                loop, the Deferred object will be failed with the same error that
                was thrown. Only the first exception will be detected. Once an
                exception is thrown the loop stops and no more items are
                processed.

                If the given action returns a Deferred object then the loop will
                wait until that Deferred has been resolved or failed before
                continuing on in the loop.
            */
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

                    try {

                        fnDeferred = fn(obj[state.keys[state.offset]]);

                        if (fnDeferred &&
                                fnDeferred.isInstance &&
                                fnDeferred.isInstance(Deferred)) {

                            fnDeferred.callback(next);
                            fnDeferred.errback(function (err) {
                                state.deferred.fail(err);
                                state.offset = state.size;
                            });

                            return;

                        }

                        state.offset = state.offset + 1;
                        defer(next);

                    } catch (e) {

                        state.deferred.fail(e);
                        state.offset = state.size;
                        return;

                    }

                }

                defer(next);
                return state.deferred.promise();

            }

            /*
                This function processes a series of functions such that the
                output of the first function is passed as input to the second
                function and so on.

                The first function recieves no input.

                This function returns a Deferred object.

                If any of the functions given throw an exception then the
                Deferred object is failed with that exception. Once an exception
                is thrown the loop stops and no more items are processed.

                Once the final function has been processed, the Deferred will be
                resolved with the output of the final functin.

                If any of the functions return Deferred objects then the loop
                will wait for that Deferred to be resolved for failed before
                continuing on.
            */
            function chain() {

                var list = Array.prototype.slice.call(arguments),
                    state = {
                        "offset": 0,
                        "size": list.length,
                        "deferred": new Deferred()
                    };

                function next(value) {

                    var fnValue;

                    if (state.offset > (state.size - 1)) {

                        state.deferred.resolve(value);
                        return;

                    }

                    try {

                        fnValue = list[state.offset](value);

                        if (fnValue &&
                                fnValue.isInstance &&
                                fnValue.isInstance(Deferred)) {

                            fnValue.callback(next);
                            fnValue.errback(function (err) {
                                state.deferred.fail(err);
                                state.offset = state.size;
                            });

                            return;

                        }

                        state.offset = state.offset + 1;
                        defer(apply(next, fnValue));

                    } catch (e) {

                        state.deferred.fail(e);
                        state.offset = state.size;
                        return;

                    }

                }

                defer(next);
                return state.deferred.promise();

            }

            sequential.forEach = forEach;
            sequential.forIn = forIn;
            sequential.chain = chain;

        }(sequential));

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
                            fnValue.isInstance &&
                            fnValue.isInstance(Deferred)) {

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

                defer(apply(next, args[x]));

            }

            return state.deferred.promise();

        }

        (function (fan) {

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
                                fnValue.isInstance &&
                                fnValue.isInstance(Deferred)) {

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

                    defer(apply(next, list[x]));

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
                                fnValue.isInstance &&
                                fnValue.isInstance(Deferred)) {

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

                    defer(apply(next, state.keys[x]));

                }

                return state.deferred.promise();

            }

            fan.forEach = forEach;
            fan.forIn = forIn;

        }(fan));

        return {
            "apply": apply,
            "sequential": sequential,
            "fan": fan
        };

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

