/*global require, define, module, describe, it, xit

*/
(function (ctx, factory) {
    "use strict";

    var env = factory.env,
        def = factory.def,
        deps = {
            amd: ['lib/expect', '../loop/loop.js'],
            node: ['./lib/expect', '../loop/index.js'],
            browser: ['expect', 'loop']
        };

    def.call(ctx, 'spec/loop', deps[env], function (expect, loop) {

        describe('The Loop library', function () {

            it('loads in the current environment (' + env + ')', function () {

                expect(loop).to.be.ok();

            });

            it('exposes a specification compliant interface', function () {

                expect(typeof loop).to.be("object");

            });

            describe("The batch module", function () {

                it('returns a promise', function (done) {

                    var t = {"test": true},
                        d = loop.batch(function () {
                            expect(t.test).to.be(true);
                        });

                    expect(d.callback).to.be.ok();
                    expect(d.errback).to.be.ok();

                    d.callback(function (value) {
                        done();
                    });

                    d.errback(function (err) {
                        expect().fail(err);
                    });

                });

                describe('The forEach function', function () {

                    it('returns a promise', function () {

                        var d = loop.batch.forEach([], function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.batch.forEach([], function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses list values as input', function (done) {

                        var d = loop.batch.forEach(['test'], function (v) {
                            expect(v).to.be('test');
                        });

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                });

                describe('The forIn function', function () {

                    it('returns a promise', function () {

                        var d = loop.batch.forIn({}, function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.batch.forIn({}, function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses object values as input', function (done) {

                        var d = loop.batch.forIn([{ "test": true }], function (v) {
                            expect(v.test).to.be(true);
                        });

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                });

                describe('The forX function', function () {

                    it('returns a promise', function () {

                        var d = loop.batch.forX(0, function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.batch.forX(0, function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses iteration numbers as input', function (done) {

                        var d = loop.batch.forX(1, function (v) {
                            expect(v).to.be(0);
                        });

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                });

                describe('The map function', function () {

                    it('returns a promise', function () {

                        var d = loop.batch.map([], function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.batch.map([], function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses list values as input', function (done) {

                        var d = loop.batch.map(['test', 'test'],
                                function (v) {
                                    expect(v).to.be('test');
                                    return v;
                                });

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('produces a new list', function (done) {

                        var d = loop.batch.map([1, 2, 3, 4, 5],
                                function (v) {
                                    return v * 2;
                                });

                        d.callback(function (value) {

                            var x;

                            expect(value.length).to.be.ok();

                            expect(value[0]).to.be(2);
                            expect(value[1]).to.be(4);
                            expect(value[2]).to.be(6);
                            expect(value[3]).to.be(8);
                            expect(value[4]).to.be(10);

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                });

                describe('The select function', function () {

                    it('returns a promise', function () {

                        var d = loop.batch.select([], function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.batch.select([], function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses list values as input', function (done) {

                        var d = loop.batch.select([2, 2, 2, 2],
                                function (item) {
                                    expect(item).to.be(2);
                                    return true;
                                });

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('produces a new list', function (done) {

                        var d = loop.batch.select([1, 1, 2, 3],
                                function (item) {
                                    return item === 2;
                                });

                        d.callback(function (value) {

                            expect(value.length).to.be(1);
                            expect(value[0]).to.be(2);
                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                });

                describe('The remove function', function () {

                    it('returns a promise', function () {

                        var d = loop.batch.remove([], function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.batch.remove([], function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses list values as input', function (done) {

                        var d = loop.batch.remove([2, 2, 2, 2],
                                function (item) {
                                    expect(item).to.be(2);
                                    return false;
                                });

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('produces a new list', function (done) {

                        var d = loop.batch.remove([1, 1, 2, 3],
                                function (item) {
                                    return item !== 2;
                                });

                        d.callback(function (value) {

                            expect(value.length).to.be(1);
                            expect(value[0]).to.be(2);
                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                });

                describe('The find function', function () {

                    it('returns a promise', function () {

                        var d = loop.batch.find([], function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.batch.find([], function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses list values as input', function (done) {

                        var d = loop.batch.find([2, 2, 2, 2],
                                function (item) {
                                    expect(item).to.be(2);
                                    return false;
                                });

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('finds a value', function (done) {

                        var d = loop.batch.find([1, 1, 2, 3],
                                function (item) {
                                    return item === 2;
                                });

                        d.callback(function (value) {

                            expect(value).to.be(2);
                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                });

                describe('The all function', function () {

                    it('returns a promise', function () {

                        var d = loop.batch.all([], function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.batch.all([], function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses list values as input', function (done) {

                        var d = loop.batch.all([2, 2, 2, 2],
                                function (item) {
                                    expect(item).to.be(2);
                                    return false;
                                });

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('returns true when all values pass', function (done) {

                        var d = loop.batch.all([1, 1, 2, 3],
                                function (item) {
                                    return item < 4;
                                });

                        d.callback(function (value) {

                            expect(value).to.be(true);
                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('returns false when any values fail', function (done) {

                        var d = loop.batch.all([1, 1, 2, 3],
                                function (item) {
                                    return item < 2;
                                });

                        d.callback(function (value) {

                            expect(value).to.be(false);
                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                });

                describe('The none function', function () {

                    it('returns a promise', function () {

                        var d = loop.batch.none([], function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.batch.none([], function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses list values as input', function (done) {

                        var d = loop.batch.none([2, 2, 2, 2],
                                function (item) {
                                    expect(item).to.be(2);
                                    return false;
                                });

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('returns true when all values fail', function (done) {

                        var d = loop.batch.none([1, 1, 2, 3],
                                function (item) {
                                    return item > 4;
                                });

                        d.callback(function (value) {

                            expect(value).to.be(true);
                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('returns false when any values passes', function (done) {

                        var d = loop.batch.none([1, 1, 2, 3],
                                function (item) {
                                    return item > 2;
                                });

                        d.callback(function (value) {

                            expect(value).to.be(false);
                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                });

                describe('The join function', function () {

                    it('returns a promise', function () {

                        var d = loop.batch.join([], function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.batch.join([], function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses list values as input', function (done) {

                        var d = loop.batch.join(['test', 'test'],
                                function (v) {
                                    expect(v).to.be('test');
                                    return v;
                                });

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('produces a new list', function (done) {

                        var d = loop.batch.join([1, 2, 3, 4, 5],
                                function (v) {
                                    return [v * 2];
                                });

                        d.callback(function (value) {

                            var x;

                            expect(value.length).to.be(5);

                            expect(value[0]).to.be(2);
                            expect(value[1]).to.be(4);
                            expect(value[2]).to.be(6);
                            expect(value[3]).to.be(8);
                            expect(value[4]).to.be(10);

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                });

            });

        });

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
