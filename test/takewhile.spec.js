/*jslint node: true, indent: 2, passfail: true */
/*global require, define, module, describe, it, xit */

"use strict";

var expect = require('expect.js'),
  Iterator = require('../iterable/iterator'),
  ArrayIter = require('../iterable/arrayiter'),
  forEachIter = require('../helper/foreach'),
  TakeWhile = require('../itertools/takewhile'),
  TestIter = require('./testiter');

describe("The TakeWhile iterable", function () {

  it("produces all values until the first positive", function (done) {

    var values = new TestIter(1, 10),
      test = function (v) { return v !== 5; },
      iter = new TakeWhile(test, values).iterator();

    iter.next().then(function (v) {
      expect(v).to.be(1);
    }).then(iter.next.bind(iter)).then(function (v) {
      expect(v).to.be(2);
    }).then(iter.next.bind(iter)).then(function (v) {
      expect(v).to.be(3);
    }).then(iter.next.bind(iter)).then(function (v) {
      expect(v).to.be(4);
    }).then(done, done);

  });

});
