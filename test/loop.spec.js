
/*jslint node: true, indent: 2, passfail: true */
/*global require, define, module, describe, it, xit */

"use strict";

var expect = require('expect.js'),
  loop = require('../loop/loop.js');

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

      expect(d).to.be.ok();
      expect(d.then).to.be.ok();
      expect(typeof d.then).to.be('function');

    });

    it('resolves a promise on completion', function (done) {

      var d = loop.for.each([], function () { return null; });

      d.then(done, function (err) { expect().fail(err); done(); });

    });

    it('uses list values as input', function (done) {

      var d = loop.for.each([true, false, null], function (v, i, l) {
        expect(v).to.be(l[i]);
      });

      d.then(done, function (err) { expect().fail(err); done(); });

    });

  });

  describe('The for.in function', function () {

    it('returns a promise', function () {

      var d = loop.for.in({}, function () { return null; });

      expect(d).to.be.ok();
      expect(d.then).to.be.ok();
      expect(typeof d.then).to.be('function');

    });

    it('resolves a promise on completion', function (done) {

      var d = loop.for.in({}, function () { return null; });

      d.then(done, function (err) { expect.fail(err); done(); });

    });

    it('uses object values as input', function (done) {

      var obj = { "test1": true, "test2": false, "test3": null },
        d = loop.for.in(obj, function (v, k, o) {
          expect(v).to.be(o[k]);
        });

      d.then(done, function (err) { expect().fail(err); done(); });

    });

  });

  describe('The for.x function', function () {

    it('returns a promise', function () {

      var d = loop.for.x(0, function () { return null; });

      expect(d).to.be.ok();
      expect(d.then).to.be.ok();
      expect(typeof d.then).to.be('function');

    });

    it('resolves a promise on completion', function (done) {

      var d = loop.for.x(0, function () { return null; });

      d.then(done, function (err) { expect().fail(err); done(); });

    });

    it('uses iteration numbers as input', function (done) {

      var x = 0,
        d = loop.for.x(10, function (v) {
          expect(v).to.be(x);
          x = x + 1;
        });

      d.then(done, function (err) { expect().fail(err); done(); });

    });

  });

  describe('The until.false function', function () {

    it('returns a promise', function () {

      var d = loop.until.false(function () {
          return false;
        }, function () {
          return null;
        });

      expect(d).to.be.ok();
      expect(d.then).to.be.ok();
      expect(typeof d.then).to.be('function');

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

      d.then(function () {

        expect(state.count).to.be(11);
        expect(state.test).to.be(false);
        done();

      }, function (err) {

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

      d.then(function () {

        expect(state.count).to.be(0);
        expect(state.test).to.be(false);
        done();

      }, function (err) {

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

      d.then(function () {

        expect(state.count).to.be(1);
        expect(state.test).to.be(false);
        done();

      }, function (err) {

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

      expect(d).to.be.ok();
      expect(d.then).to.be.ok();
      expect(typeof d.then).to.be('function');

    });

    it('resolves a promise on completion', function (done) {

      var d = loop.until.true(function () {
          return true;
        }, function () {
          return null;
        });

      d.then(function () {

        done();

      }, function (err) {

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

      d.then(function () {

        expect(state.count).to.be(11);
        expect(state.test).to.be(true);
        done();

      }, function (err) {

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

      d.then(function () {

        expect(state.count).to.be(0);
        expect(state.test).to.be(true);
        done();

      }, function (err) {

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

      d.then(function () {

        expect(state.count).to.be(1);
        expect(state.test).to.be(true);
        done();

      }, function (err) {

        expect().fail(err);
        done();

      });

    });

  });

  describe('The map function', function () {

    it('returns a promise', function () {

      var d = loop.map([], function () { return null; });

      expect(d).to.be.ok();
      expect(d.then).to.be.ok();
      expect(typeof d.then).to.be('function');

    });

    it('resolves a promise on completion', function (done) {

      var d = loop.map([], function () { return null; });

      d.then(function () {

        done();

      }, function (err) {

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

      d.then(function () {

        done();

      }, function (err) {

        expect().fail(err);
        done();

      });

    });

    it('produces a new list', function (done) {

      var list = [1, 2, 3, 4, 5, 6],
        timesTwo = function (v) { return v * 2; },
        d = loop.map(list, timesTwo);

      d.then(function (newList) {

        var x;

        expect(newList).to.be.ok();
        expect(newList.length).to.be.ok();
        expect(newList.length).to.be(list.length);

        for (x = 0; x < newList.length; x = x + 1) {

          expect(newList[x]).to.be(timesTwo(list[x]));

        }

        done();

      }, function (err) {

        expect().fail(err);
        done();

      });

    });

  });

  describe('The reduce function', function () {

    it('returns a promise', function () {

      var d = loop.reduce([], function () { return false; }, 0);

      expect(d).to.be.ok();
      expect(d.then).to.be.ok();
      expect(typeof d.then).to.be('function');

    });

    it('resolves a promise on completion', function (done) {

      var d = loop.reduce([], function () { return false; }, 0);

      d.then(function () {

        done();

      }, function (err) {

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

      d.then(function () {

        done();

      }, function (err) {

        expect().fail(err);
        done();

      });

    });

    it('produces a new value', function (done) {

      var list = [1, 1, 2, 3, 5, 8],
        sum = function (left, right) { return left + right; },
        d = loop.reduce(list, sum, 0);

      d.then(function (value) {

        var x, testValue = 0;
        for (x = 0; x < list.length; x = x + 1) {

          testValue = sum(testValue, list[x]);

        }

        expect(value).to.be(testValue);
        done();

      }, function (err) {

        expect().fail(err);
        done();

      });

    });

  });

  describe('The select function', function () {

    it('returns a promise', function () {

      var d = loop.select([], function () { return false; });

      expect(d).to.be.ok();
      expect(d.then).to.be.ok();
      expect(typeof d.then).to.be('function');

    });

    it('resolves a promise on completion', function (done) {

      var d = loop.select([], function () { return false; });

      d.then(function () {

        done();

      }, function (err) {

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

      d.then(function () {

        done();

      }, function (err) {

        expect().fail(err);
        done();

      });

    });

    it('produces a new list', function (done) {

      var list = [1, 1, 2, 3, 5, 8],
        test = function (v) { return v === 2; },
        d = loop.select(list, test);

      d.then(function (newList) {

        expect(newList.length).to.be(1);
        expect(newList[0]).to.be(2);
        done();

      }, function (err) {

        expect().fail(err);
        done();

      });

    });

  });

  describe('The remove function', function () {

    it('returns a promise', function () {

      var d = loop.remove([], function () { return false; });

      expect(d).to.be.ok();
      expect(d.then).to.be.ok();
      expect(typeof d.then).to.be('function');

    });

    it('resolves a promise on completion', function (done) {

      var d = loop.remove([], function () { return false; });

      d.then(function () {

        done();

      }, function (err) {

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

      d.then(function () {

        done();

      }, function (err) {

        expect().fail(err);
        done();

      });

    });

    it('produces a new list', function (done) {

      var list = [1, 1, 2, 3, 5, 8],
        test = function (v) { return v !== 2; },
        d = loop.remove(list, test);

      d.then(function (newList) {

        expect(newList.length).to.be(1);
        expect(newList[0]).to.be(2);
        done();

      }, function (err) {

        expect().fail(err);
        done();

      });

    });

  });

  describe('The all function', function () {

    it('returns a promise', function () {

      var d = loop.all([], function () { return false; });

      expect(d).to.be.ok();
      expect(d.then).to.be.ok();
      expect(typeof d.then).to.be('function');

    });

    it('resolves a promise on completion', function (done) {

      var d = loop.all([], function () { return false; });

      d.then(function () {

        done();

      }, function (err) {

        expect().fail(err);
        done();

      });

    });

    it('uses list values as input', function (done) {

      var d = loop.all([2, 2, 2, 2],
        function (item) {
          expect(item).to.be(2);
          return true;
        });

      d.then(function () {

        done();

      }, function (err) {

        expect().fail(err);
        done();

      });

    });

    it('returns true when all values pass', function (done) {

      var d = loop.all([1, 1, 2, 3],
        function (item) {
          return item < 4;
        });

      d.then(function (value) {

        expect(value).to.be(true);
        done();

      }, function (err) {

        expect().fail(err);
        done();

      });

    });

    it('returns false when any values fail', function (done) {

      var d = loop.all([1, 1, 2, 3],
        function (item) {
          return item < 2;
        });

      d.then(function (value) {

        expect(value).to.be(false);
        done();

      }, function (err) {

        expect().fail(err);
        done();

      });

    });

  });

  describe('The none function', function () {

    it('returns a promise', function () {

      var d = loop.none([], function () { return false; });

      expect(d).to.be.ok();
      expect(d.then).to.be.ok();
      expect(typeof d.then).to.be('function');

    });

    it('resolves a promise on completion', function (done) {

      var d = loop.none([], function () { return false; });

      d.then(function () {

        done();

      }, function (err) {

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

      d.then(function () {

        done();

      }, function (err) {

        expect().fail(err);
        done();

      });

    });

    it('returns true when all values fail', function (done) {

      var d = loop.none([1, 1, 2, 3],
        function (item) {
          return item > 4;
        });

      d.then(function (value) {

        expect(value).to.be(true);
        done();

      }, function (err) {

        expect().fail(err);
        done();

      });

    });

    it('returns false when any values passes', function (done) {

      var d = loop.none([1, 1, 2, 3],
        function (item) {
          return item > 2;
        });

      d.then(function (value) {

        expect(value).to.be(false);
        done();

      }, function (err) {

        expect().fail(err);
        done();

      });

    });

  });

});
