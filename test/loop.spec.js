
/*jslint node: true, indent: 2, passfail: true */
/*global require, define, module, describe, it, xit */

(function (context, generator) {
  "use strict";

  generator.call(
    context,
    'tests/loopjs',
    ['expect', 'loopjs'],
    function (expect, loop) {

      describe('The Loop library', function () {

        it('loads in the current environment.', function () {

          expect(loop).to.be.ok();

        });

        it('exposes a specification compliant interface', function () {

          expect(typeof loop).to.be("object");
          expect(typeof loop.for.x).to.be("function");
          expect(typeof loop.for.in).to.be("function");
          expect(typeof loop.for.each).to.be("function");
          expect(typeof loop.until.true).to.be("function");
          expect(typeof loop.until.false).to.be("function");
          expect(typeof loop.map).to.be("function");
          expect(typeof loop.reduce).to.be("function");
          expect(typeof loop.select).to.be("function");
          expect(typeof loop.remove).to.be("function");
          expect(typeof loop.all).to.be("function");
          expect(typeof loop.none).to.be("function");

        });

        describe('The for.each function', function () {

          it('returns a promise', function () {

            var d = loop.for.each([], function () { return null; });

            expect(d.callback).to.be.ok();
            expect(d.errback).to.be.ok();

          });

          it('resolves a promise on completion', function (done) {

            var d = loop.for.each([], function () { return null; });

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

          it('uses list values as input', function (done) {

            var d = loop.for.each(['test'], function (v) {
              expect(v).to.be('test');
            });

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

        });

        describe('The for.in function', function () {

          it('returns a promise', function () {

            var d = loop.for.in({}, function () { return null; });

            expect(d.callback).to.be.ok();
            expect(d.errback).to.be.ok();

          });

          it('resolves a promise on completion', function (done) {

            var d = loop.for.in({}, function () { return null; });

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

          it('uses object values as input', function (done) {

            var d = loop.for.in({ "test": true }, function (v, k, o) {
              expect(v).to.be(true);
              expect(k).to.be('test');
              expect(o.test).to.be(true);
            });

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

        });

        describe('The for.x function', function () {

          it('returns a promise', function () {

            var d = loop.for.x(0, function () { return null; });

            expect(d.callback).to.be.ok();
            expect(d.errback).to.be.ok();

          });

          it('resolves a promise on completion', function (done) {

            var d = loop.for.x(0, function () { return null; });

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

          it('uses iteration numbers as input', function (done) {

            var d = loop.for.x(1, function (v) {
              expect(v).to.be(0);
            });

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

        });

        describe('The until.false function', function () {

          it('returns a promise', function () {

            var d = loop.until.false(function () {
                return false;
              }, function () {
                return null;
              });

            expect(d.callback).to.be.ok();
            expect(d.errback).to.be.ok();

          });

          it('resolves a promise on completion', function (done) {

            var d = loop.until.false(function () {
                return false;
              }, function () {
                return null;
              });

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

          it('resolves when test returns false', function (done) {

            var state = {test: true, count: 0},
              d = loop.until.false(function () {

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
              d = loop.until.false(function () {

                return state.test;

              }, function () {

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

          it('checks can run doWhile', function (done) {

            var state = {test: false, count: 0},
              d = loop.until.false(function () {

                return state.test;

              }, function () {

                state.count = state.count + 1;

              }, true);

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

        describe('The until.true function', function () {

          it('returns a promise', function () {

            var d = loop.until.true(function () {
                return true;
              }, function () {
                return null;
              });

            expect(d.callback).to.be.ok();
            expect(d.errback).to.be.ok();

          });

          it('resolves a promise on completion', function (done) {

            var d = loop.until.true(function () {
                return true;
              }, function () {
                return null;
              });

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

          it('resolves when test returns true', function (done) {

            var state = {test: false, count: 0},
              d = loop.until.true(function () {

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
              d = loop.until.true(function () {

                return state.test;

              }, function () {

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

          it('checks can run doWhile', function (done) {

            var state = {test: true, count: 0},
              d = loop.until.true(function () {

                return state.test;

              }, function () {

                state.count = state.count + 1;

              }, true);

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

            var d = loop.map([], function () { return null; });

            expect(d.callback).to.be.ok();
            expect(d.errback).to.be.ok();

          });

          it('resolves a promise on completion', function (done) {

            var d = loop.map([], function () { return null; });

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

          it('uses list values as input', function (done) {

            var d = loop.map(['test', 'test'],
              function (v) {
                expect(v).to.be('test');
                return v;
              });

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

          it('produces a new list', function (done) {

            var d = loop.map([1, 2, 3, 4, 5],
              function (v) {
                return v * 2;
              });

            d.callback(function (value) {

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

            var d = loop.reduce([], function () { return false; }, 0);

            expect(d.callback).to.be.ok();
            expect(d.errback).to.be.ok();

          });

          it('resolves a promise on completion', function (done) {

            var d = loop.reduce([], function () { return false; }, 0);

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

          it('uses list values as input', function (done) {

            var d = loop.reduce([1, 1],
              function (item, val) {
                expect(item).to.be(1);
                return val + item;
              },
              0);

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

          it('produces a new value', function (done) {

            var d = loop.reduce([1, 1, 2, 3],
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

            var d = loop.select([], function () { return false; });

            expect(d.callback).to.be.ok();
            expect(d.errback).to.be.ok();

          });

          it('resolves a promise on completion', function (done) {

            var d = loop.select([], function () { return false; });

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

          it('uses list values as input', function (done) {

            var d = loop.select([2, 2, 2, 2],
              function (item) {
                expect(item).to.be(2);
                return true;
              });

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

          it('produces a new list', function (done) {

            var d = loop.select([1, 1, 2, 3],
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

            var d = loop.remove([], function () { return false; });

            expect(d.callback).to.be.ok();
            expect(d.errback).to.be.ok();

          });

          it('resolves a promise on completion', function (done) {

            var d = loop.remove([], function () { return false; });

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

          it('uses list values as input', function (done) {

            var d = loop.remove([2, 2, 2, 2],
              function (item) {
                expect(item).to.be(2);
                return false;
              });

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

          it('produces a new list', function (done) {

            var d = loop.remove([1, 1, 2, 3],
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

        describe('The all function', function () {

          it('returns a promise', function () {

            var d = loop.all([], function () { return false; });

            expect(d.callback).to.be.ok();
            expect(d.errback).to.be.ok();

          });

          it('resolves a promise on completion', function (done) {

            var d = loop.all([], function () { return false; });

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

          it('uses list values as input', function (done) {

            var d = loop.all([2, 2, 2, 2],
              function (item) {
                expect(item).to.be(2);
                return false;
              });

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

          it('returns true when all values pass', function (done) {

            var d = loop.all([1, 1, 2, 3],
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

            var d = loop.all([1, 1, 2, 3],
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

            var d = loop.none([], function () { return false; });

            expect(d.callback).to.be.ok();
            expect(d.errback).to.be.ok();

          });

          it('resolves a promise on completion', function (done) {

            var d = loop.none([], function () { return false; });

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

          it('uses list values as input', function (done) {

            var d = loop.none([2, 2, 2, 2],
              function (item) {
                expect(item).to.be(2);
                return false;
              });

            d.callback(function () {

              done();

            });

            d.errback(function (err) {

              expect().fail(err);
              done();

            });

          });

          it('returns true when all values fail', function (done) {

            var d = loop.none([1, 1, 2, 3],
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

            var d = loop.none([1, 1, 2, 3],
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

      });

    }
  );

}(this, (function (context) {
  "use strict";

  // Ignoring the unused "name" in the Node.js definition function.
  /*jslint unparam: true */
  if (typeof require === "function" &&
        module !== undefined &&
        !!module.exports) {

    // If this module is loaded in Node, require each of the
    // dependencies and pass them along.
    return function (name, deps, mod) {

      var x,
        dep_list = [];

      for (x = 0; x < deps.length; x = x + 1) {

        dep_list.push(require(deps[x]));

      }

      module.exports = mod.apply(context, dep_list);

    };

  }
  /*jslint unparam: false */

  if (context.window !== undefined) {

    // If this module is being used in a browser environment first
    // generate a list of dependencies, run the provided definition
    // function with the list of dependencies, and insert the returned
    // object into the global namespace using the provided module name.
    return function (name, deps, mod) {

      var namespaces = name.split('/'),
        root = context,
        dep_list = [],
        current_scope,
        current_dep,
        i,
        x;

      for (i = 0; i < deps.length; i = i + 1) {

        current_scope = root;
        current_dep = deps[i].split('/');

        for (x = 0; x < current_dep.length; x = x + 1) {

          current_scope = current_scope[current_dep[x]] =
                          current_scope[current_dep[x]] || {};

        }

        dep_list.push(current_scope);

      }

      current_scope = root;
      for (i = 1; i < namespaces.length; i = i + 1) {

        current_scope = current_scope[namespaces[i - 1]] =
                        current_scope[namespaces[i - 1]] || {};

      }

      current_scope[namespaces[i - 1]] = mod.apply(context, dep_list);

    };

  }

  throw new Error("Unrecognized environment.");

}(this))));
