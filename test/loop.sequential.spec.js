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

            describe('The sequential module', function () {

                it('returns a promise', function () {

                    var t = {"test": true},
                        d = loop.sequential(function () {
                            expect(t.test).to.be(true);
                        });

                    expect(d.callback).to.be.ok();
                    expect(d.errback).to.be.ok();

                });

                it('runs async functions sequentially', function (done) {

                    var t = {"test": true},
                        d = loop.sequential(function () {
                            expect(t.test).to.be(true);
                            t.test = false;
                        }, function () {
                            expect(t.test).to.be(false);
                        });

                    d.callback(function (value) {

                        done();

                    });

                    d.errback(function (err) {

                        expect().fail(err);
                        done();

                    });

                });

                describe('The forEach function', function () {

                    it('returns a promise', function () {

                        var d = loop.sequential.forEach([], function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.sequential.forEach([], function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses list values as input', function (done) {

                        var d = loop.sequential.forEach(['test'], function (v) {
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

                        var d = loop.sequential.forIn({}, function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.sequential.forIn({}, function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses object values as input', function (done) {

                        var d = loop.sequential.forIn([{ "test": true }], function (v) {
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

                        var d = loop.sequential.forX(0, function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.sequential.forX(0, function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses iteration numbers as input', function (done) {

                        var d = loop.sequential.forX(1, function (v) {
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

                describe('The untilFalse function', function () {

                    it('returns a promise', function () {

                        var d = loop.sequential.untilFalse(function () {
                            return false;
                        }, function () {

                        });

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.sequential.untilFalse(function () {
                            return false;
                        }, function () {

                        });

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('resolves when test returns false', function (done) {

                        var state = {test: true, count: 0},
                            d = loop.sequential.untilFalse(function () {

                                return state.test;

                            }, function () {

                                if (state.count === 10) {
                                    state.test = false;
                                }

                                state.count = state.count + 1;

                            });

                        d.callback(function () {

                            expect(state.count).to.be(11);
                            expect(state.test).to.be(false);
                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('checks condition before first run', function (done) {

                        var state = {test: false, count: 0},
                            d = loop.sequential.untilFalse(function () {

                                return state.test;

                            }, function () {

                                if (state.count === 10) {
                                    state.test = false;
                                }

                                state.count = state.count + 1;

                            });

                        d.callback(function () {

                            expect(state.count).to.be(0);
                            expect(state.test).to.be(false);
                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                });

                describe('The doUntilFalse function', function () {

                    it('returns a promise', function () {

                        var d = loop.sequential.doUntilFalse(function () {
                            return false;
                        }, function () {

                        });

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.sequential.doUntilFalse(function () {
                            return false;
                        }, function () {

                        });

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('resolves when test returns false', function (done) {

                        var state = {test: true, count: 0},
                            d = loop.sequential.doUntilFalse(function () {

                                return state.test;

                            }, function () {

                                if (state.count === 10) {
                                    state.test = false;
                                }

                                state.count = state.count + 1;

                            });

                        d.callback(function () {

                            expect(state.count).to.be(11);
                            expect(state.test).to.be(false);
                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('runs first before condition check', function (done) {

                        var state = {test: false, count: 0},
                            d = loop.sequential.doUntilFalse(function () {

                                return state.test;

                            }, function () {

                                if (state.count === 10) {
                                    state.test = false;
                                }

                                state.count = state.count + 1;

                            });

                        d.callback(function () {

                            expect(state.count).to.be(1);
                            expect(state.test).to.be(false);
                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                });

                describe('The untilTrue function', function () {

                    it('returns a promise', function () {

                        var d = loop.sequential.untilTrue(function () {
                            return true;
                        }, function () {

                        });

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.sequential.untilTrue(function () {
                            return true;
                        }, function () {

                        });

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('resolves when test returns true', function (done) {

                        var state = {test: false, count: 0},
                            d = loop.sequential.untilTrue(function () {

                                return state.test;

                            }, function () {

                                if (state.count === 10) {
                                    state.test = true;
                                }

                                state.count = state.count + 1;

                            });

                        d.callback(function () {

                            expect(state.count).to.be(11);
                            expect(state.test).to.be(true);
                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('checks condition before first run', function (done) {

                        var state = {test: true, count: 0},
                            d = loop.sequential.untilTrue(function () {

                                return state.test;

                            }, function () {

                                if (state.count === 10) {
                                    state.test = true;
                                }

                                state.count = state.count + 1;

                            });

                        d.callback(function () {

                            expect(state.count).to.be(0);
                            expect(state.test).to.be(true);
                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                });

                describe('The doUntilTrue function', function () {

                    it('returns a promise', function () {

                        var d = loop.sequential.doUntilTrue(function () {
                            return true;
                        }, function () {

                        });

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.sequential.doUntilTrue(function () {
                            return true;
                        }, function () {

                        });

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('resolves when test returns true', function (done) {

                        var state = {test: false, count: 0},
                            d = loop.sequential.doUntilTrue(function () {

                                return state.test;

                            }, function () {

                                if (state.count === 10) {
                                    state.test = true;
                                }

                                state.count = state.count + 1;

                            });

                        d.callback(function () {

                            expect(state.count).to.be(11);
                            expect(state.test).to.be(true);
                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('runs first before condition check', function (done) {

                        var state = {test: true, count: 0},
                            d = loop.sequential.doUntilTrue(function () {

                                return state.test;

                            }, function () {

                                if (state.count === 10) {
                                    state.test = true;
                                }

                                state.count = state.count + 1;

                            });

                        d.callback(function () {

                            expect(state.count).to.be(1);
                            expect(state.test).to.be(true);
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

                        var d = loop.sequential.map([], function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.sequential.map([], function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses list values as input', function (done) {

                        var d = loop.sequential.map(['test', 'test'],
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

                        var d = loop.sequential.map([1, 2, 3, 4, 5],
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

                describe('The reduce function', function () {

                    it('returns a promise', function () {

                        var d = loop.sequential.reduce([], function () {}, 0);

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.sequential.reduce([], function () {}, 0);

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses list values as input', function (done) {

                        var d = loop.sequential.reduce([1, 1],
                                function (item, val) {
                                    expect(item).to.be(1);
                                    return val + item;
                                },
                                0);

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('produces a new value', function (done) {

                        var d = loop.sequential.reduce([1, 1, 2, 3],
                                function (item, val) {
                                    return val + item;
                                },
                                0);

                        d.callback(function (value) {

                            expect(value).to.be(7);
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

                        var d = loop.sequential.select([], function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.sequential.select([], function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses list values as input', function (done) {

                        var d = loop.sequential.select([2, 2, 2, 2],
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

                        var d = loop.sequential.select([1, 1, 2, 3],
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

                        var d = loop.sequential.remove([], function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.sequential.remove([], function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses list values as input', function (done) {

                        var d = loop.sequential.remove([2, 2, 2, 2],
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

                        var d = loop.sequential.remove([1, 1, 2, 3],
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

                        var d = loop.sequential.find([], function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.sequential.find([], function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses list values as input', function (done) {

                        var d = loop.sequential.find([2, 2, 2, 2],
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

                        var d = loop.sequential.find([1, 1, 2, 3],
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

                        var d = loop.sequential.all([], function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.sequential.all([], function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses list values as input', function (done) {

                        var d = loop.sequential.all([2, 2, 2, 2],
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

                        var d = loop.sequential.all([1, 1, 2, 3],
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

                        var d = loop.sequential.all([1, 1, 2, 3],
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

                        var d = loop.sequential.none([], function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.sequential.none([], function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses list values as input', function (done) {

                        var d = loop.sequential.none([2, 2, 2, 2],
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

                        var d = loop.sequential.none([1, 1, 2, 3],
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

                        var d = loop.sequential.none([1, 1, 2, 3],
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

                        var d = loop.sequential.join([], function () {});

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.sequential.join([], function () {});

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('uses list values as input', function (done) {

                        var d = loop.sequential.join(['test', 'test'],
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

                        var d = loop.sequential.join([1, 2, 3, 4, 5],
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

                describe('The chain function', function () {

                    it('returns a promise', function () {

                        var d = loop.sequential.chain();

                        expect(d.callback).to.be.ok();
                        expect(d.errback).to.be.ok();

                    });

                    it('resolves a promise on completion', function (done) {

                        var d = loop.sequential.chain();

                        d.callback(function (value) {

                            done();

                        });

                        d.errback(function (err) {

                            expect().fail(err);
                            done();

                        });

                    });

                    it('passes input from one function to the next', function (done) {

                        var d = loop.sequential.chain(function (v) {
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
