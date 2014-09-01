/*jslint node: true, indent: 2, passfail: true */
/*global require, define, module, describe, it, xit */

"use strict";

var expect = require('expect.js'),
  Iterator = require('../iterable/iterator'),
  ArrayIter = require('../iterable/arrayiter'),
  forEachIter = require('../helper/foreach'),
  Count = require('../itertools/count'),
  TestIter = require('./testiter');

describe("The Count iterable", function () {

  it("starts at the given value", function (done) {

    var iter = new Count(10).iterator();

    iter.next().then(function (v) {
      expect(v).to.be(10);
    }).then(iter.next.bind(iter)).then(function (v) {
      expect(v).to.be(11);
    }).then(done, done);

  });

  it("increments using the given step", function (done) {

    var iter = new Count(10, 2).iterator();

    iter.next().then(function (v) {
      expect(v).to.be(10);
    }).then(iter.next.bind(iter)).then(function (v) {
      expect(v).to.be(12);
    }).then(done, done);

  });

});
