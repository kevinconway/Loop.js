/*global require, define, module, describe, it, xit

*/
(function (factory) {
    "use strict";

    var env = factory.env,
        def = factory.def,
        deps = {
            amd: ['lib/expect', '../loop/loop.js'],
            node: ['./lib/expect', '../loop/loop.js'],
            browser: ['expect', 'loop']
        };

    def.call(this, 'spec/loop', deps[env], function (expect, loop) {

        describe('The Loop library', function () {

            it('loads in the current environment (' + env + ')', function () {

                expect(loop).to.be.ok();

            });

            it('exposes a specification compliant interface', function () {

                expect(typeof loop).to.be("object");

            });

            describe('The forEach function', function () {

                it('returns a promise', function () {

                    var d = loop.forEach([], function () {});

                    expect(d.callback).to.be.ok();
                    expect(d.errback).to.be.ok();

                });

                it('resolves a promise on completion', function (done) {

                    var d = loop.forEach([], function () {});

                    d.callback(function (value) {

                        done();

                    });

                    d.errback(function (err) {

                        done();

                    });

                });

                it('uses list values as input', function (done) {

                    var d = loop.forEach(['test'], function (v) {
                        expect(v).to.be('test');
                    });

                    d.callback(function (value) {

                        done();

                    });

                    d.errback(function (err) {

                        done();

                    });

                });

            });

            describe('The forIn function', function () {

                it('returns a promise', function () {

                    var d = loop.forIn([], function () {});

                    expect(d.callback).to.be.ok();
                    expect(d.errback).to.be.ok();

                });

                it('resolves a promise on completion', function (done) {

                    var d = loop.forIn([], function () {});

                    d.callback(function (value) {

                        done();

                    });

                    d.errback(function (err) {

                        done();

                    });

                });

                it('uses object values as input', function (done) {

                    var d = loop.forEach([{ "test": true }], function (v) {
                        expect(v.test).to.be(true);
                    });

                    d.callback(function (value) {

                        done();

                    });

                    d.errback(function (err) {

                        done();

                    });

                });

            });

            describe('The chain function', function () {

                it('returns a promise', function () {

                    var d = loop.chain([]);

                    expect(d.callback).to.be.ok();
                    expect(d.errback).to.be.ok();

                });

                it('resolves a promise on completion', function (done) {

                    var d = loop.chain([]);

                    d.callback(function (value) {

                        done();

                    });

                    d.errback(function (err) {

                        done();

                    });

                });

                it('passes input from one function to the next', function (done) {

                    var d = loop.forEach(function (v) {
                        return 'test';
                    }, function (v) {
                        expect(v).to.be('test');
                        return 'test2';
                    }, function (v) {
                        expect(v).to.be('test2');
                        return 'test3';
                    });

                    d.callback(function (value) {

                        expect(value).to.be('test3');
                        done();

                    });

                    d.errback(function (err) {

                        done();

                    });

                });

            });

        });

    });

}.call(this, (function () {
    "use strict";

    var currentEnvironment,
        generator;

    // Check the environment to determine the dependency management strategy.

    if (typeof define === "function" && !!define.amd) {

        currentEnvironment = 'amd';

    } else if (typeof require === "function" &&
                        module !== undefined && !!module.exports) {

        currentEnvironment = 'node';

    } else if (this.window !== undefined) {

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

    }.call());


    return {
        env: currentEnvironment,
        def: generator
    };

}.call(this))));
