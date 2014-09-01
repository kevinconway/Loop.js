/*
The MIT License (MIT)
Copyright (c) 2014 Kevin Conway

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

/*jslint node: true, indent: 2, passfail: true, continue: true */

module.exports = (function () {
  "use strict";

  var forEachIter = require('../helper/foreach'),
    args = require('../helper/args'),
    callbackHelper = require('../helper/callback'),
    Iterable = require('../iterable/iterator'),
    Map = require('./map'),
    Filter = require('./filter'),
    Chain = require('./chain'),
    Slice = require('./slice');

  Iterable.prototype.toArray = function toArray(callback) {

    var helper = callbackHelper.call(undefined, callback),
      response = [];

    forEachIter(this, response.push.bind(response)).then(
      helper.resolve.bind(undefined, response),
      helper.reject
    );

    return helper.response;

  };

  Iterable.prototype.concat = function concat() {

    return new Chain.apply(
      undefined,
      [this].concat(args.apply(undefined, arguments))
    );

  };

  Iterable.prototype.join = function join(seperator, callback) {

    var helper = callbackHelper.call(undefined, callback);

    this.toArray().then(function (r, v) {
      r(v.join(seperator));
    }.bind(undefined, helper.resolve), helper.reject);

    return helper.response;

  };

  Iterable.prototype.slice = function slice(start, stop, step) {

    return new Slice(this.iterator(), start, stop, step);

  };

  Iterable.prototype.forEach = function forEach(fn, thisArg, callback) {

    var helper = callbackHelper.call(undefined, callback);

    forEachIter(this.iterator(), fn.bind(thisArg)).then(
      helper.resolve,
      helper.reject
    );

    return helper.response;

  };

  Iterable.prototype.every = function every(test, thisArg, callback) {

    var helper = callbackHelper.call(undefined, callback);

    this.toArray().then(
      function (arr) { return arr.every(test, thisArg); }
    ).then(
      helper.resolve,
      helper.reject
    );

    return helper.response;

  };

  Iterable.prototype.some = function some(test, thisArg, callback) {

    var helper = callbackHelper.call(undefined, callback);

    this.toArray().then(
      function (arr) { return arr.some(test, thisArg); }
    ).then(
      helper.resolve,
      helper.reject
    );

    return helper.response;

  };

  Iterable.prototype.filter = function filter(test, thisArg) {

    return new Filter(test.bind(thisArg), this.iterator());

  };

  Iterable.prototype.map = function map(fn, thisArg) {

    return new Map(fn.bind(thisArg), this.iterator());

  };

  return Iterable;

}());
