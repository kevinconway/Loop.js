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

  var Deferred = require('deferredjs'),
    defer = require('deferjs'),
    pkg = {};

  pkg.for = (function () {

    function forX(x, fn, limit) {

      var d = new Deferred(),
        y = 0,
        promises = [],
        collection,
        length = x;
      limit = limit || 1;

      if (length < 1) {

        return d.resolve().promise();

      }

      if (limit > length) {

        limit = length;

      }

      for (y = 0; y < limit; y = y + 1) {

        promises.push(
          Deferred.convert(fn)(y)
        );

      }

      for (y = limit; y < length; y = y + 1) {

        promises[y % limit] = promises[y % limit].then(
          Deferred.convert(defer.bind(fn, null, y)),
          defer.bind(d.fail, d)
        );

      }

      collection = Deferred.Collection.All.apply(null, promises);
      collection.then(function () {

        d.resolve();

      }, defer.bind(d.reject, d));

      return d.promise();

    }

    function forEach(list, fn, limit) {

      function forEachHandler(x) {

        return Deferred.convert(fn)(list[x], x, list);

      }

      return forX(list.length, forEachHandler, limit);

    }

    function forIn(obj, fn, limit) {

      var keys = [],
        key;

      for (key in obj) {

        if (obj.hasOwnProperty(key)) {

          keys.push(key);

        }

      }

      function forInHandler(k) {

        return Deferred.convert(fn)(obj[k], k, obj);

      }

      return forEach(keys, forInHandler, limit);

    }

    return {
      'each': forEach,
      'in': forIn,
      'x': forX
    };

  }());

  pkg.until = (function () {

    function untilCheck(testFn, testVal) {

      return Deferred.convert(testFn)().then(function (val) {

        return val === testVal;

      });

    }

    function untilBlock(fn, testFn, testVal, doUntil) {

      doUntil = !!doUntil || false;

      if (doUntil === false) {

        return untilCheck(testFn, testVal).then(function (result) {

          if (result === false) {

            return Deferred.convert(fn)().then(
              defer.bind(untilCheck, null, testFn, testVal)
            );

          }

          return true;

        });

      }

      return Deferred.convert(fn)().then(
        defer.bind(untilCheck, null, testFn, testVal)
      );

    }

    function untilLoop(fn, testFn, testVal, doUntil, d) {

      d = d || new Deferred();

      untilBlock(fn, testFn, testVal, doUntil).then(
        function (stop) {

          if (stop === true) {

            d.resolve();
            return null;

          }

          return untilLoop(fn, testFn, testVal, doUntil, d);

        }
      );

      return d.promise();

    }

    function untilFalse(test, fn, doUntil) {

      return untilLoop(fn, test, false, doUntil);

    }

    function untilTrue(test, fn, doUntil) {

      return untilLoop(fn, test, true, doUntil);

    }

    return {
      "true": untilTrue,
      "false": untilFalse
    };

  }());

  pkg.map = function map(list, fn, limit) {

    var result = [];

    function mapHandler(item, idx) {

      return Deferred.convert(fn)(item).then(
        function (value) {
          result[idx] = value;
        }
      );

    }

    return pkg.for.each(list, mapHandler, limit).then(
      function () { return result; }
    );

  };

  pkg.reduce = function reduce(list, fn, value) {

    var container = {"value": value};

    function reduceHandler(item) {

      return Deferred.convert(fn)(item, container.value).then(
        function (newValue) { container.value = newValue; }
      );

    }

    return pkg.for.each(list, reduceHandler).then(
      function () { return container.value; }
    );

  };

  pkg.select = function select(list, test) {

    var result = [];

    function selectHandler(testList) {

      var x;
      for (x = 0; x < testList.length; x = x + 1) {

        if (testList[x] === true) {

          result.push(list[x]);

        }

      }

      return result;

    }

    return pkg.map(list, test).then(selectHandler);

  };

  pkg.remove = function remove(list, test) {

    var result = [];

    function selectHandler(testList) {

      var x;
      for (x = 0; x < testList.length; x = x + 1) {

        if (testList[x] === false) {

          result.push(list[x]);

        }

      }

      return result;

    }

    return pkg.map(list, test).then(selectHandler);

  };

  pkg.all = function all(list, test) {

    function allHandler(newList) {

      return newList.length === 0;

    }

    return pkg.remove(list, test).then(allHandler);

  };

  pkg.none = function none(list, test) {

    function allHandler(newList) {

      return newList.length === 0;

    }

    return pkg.select(list, test).then(allHandler);

  };

  return pkg;

}());
