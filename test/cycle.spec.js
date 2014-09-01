/*jslint node: true, indent: 2, passfail: true */
/*global require, define, module, describe, it, xit */

"use strict";

var expect = require('expect.js'),
  Iterator = require('../iterable/iterator'),
  ArrayIter = require('../iterable/arrayiter'),
  forEachIter = require('../helper/foreach'),
  Cycle = require('../itertools/cycle'),
  TestIter = require('./testiter');

describe("The Cycle iterable", function () {

  it("repeats a given iterable", function (done) {

    var iter = new Cycle([1, 2, 3, 4]).iterator();

    iter.next().then(function (v) {
      expect(v).to.be(1);
    }).then(iter.next.bind(iter)).then(function (v) {
      expect(v).to.be(2);
    }).then(iter.next.bind(iter)).then(function (v) {
      expect(v).to.be(3);
    }).then(iter.next.bind(iter)).then(function (v) {
      expect(v).to.be(4);
    }).then(iter.next.bind(iter)).then(function (v) {
      expect(v).to.be(1);
    }).then(iter.next.bind(iter)).then(function (v) {
      expect(v).to.be(2);
    }).then(done, done);

  });

});
