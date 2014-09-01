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

  var util = require('util'),
    Iterator = require('../iterable/iterator'),
    Iterable = require('../iterable/iterable');

  function CountIterator(start, step) {

    Iterator.call(this);
    this.value = start || 0;
    this.step = step || 1;

  }
  util.inherits(CountIterator, Iterator);

  CountIterator.prototype.iter = function iter(resolve) {

    resolve(this.value);
    this.value = this.value + this.step;

  };

  function CountIterable(start, step) {

    Iterable.call(this);
    this.value = start || 0;
    this.step = step || 1;

  }
  util.inherits(CountIterable, Iterable);

  CountIterable.prototype.iterator = function iterator() {

    return new CountIterator(this.value, this.step);

  };

  return CountIterable;

}());
