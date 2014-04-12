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

/*jslint node: true, indent: 2, passfail: true */

(function (context, generator) {
  "use strict";

  generator.call(
    context,
    'loopjs',
    ['deferjs', 'modelo', 'deferredjs'],
    function (defer, Modelo, Deferred) {

      var engine,
        pkg = {},
        State = Modelo.define(function (options) {

          this.deferred = new Deferred();
          this.offset = options.offset || 0;
          this.size = options.size || 0;
          this.limit = options.limit || 1;

        });

      function TRUE() {

        return true;

      }

      engine = (function () {

        function ensureDeferred(fn) {

          var value,
            args = Array.prototype.slice.call(arguments, 1),
            d = new Deferred();

          try {

            value = fn.apply(null, args);

            if (!!value && !!value.callback && !!value.errback) {

              return value;

            }

            d.resolve(value);

          } catch (e) {

            d.fail(e);

          }

          return d.promise();

        }

        function iter(
          state,
          precondition,
          action,
          handle,
          postcondition,
          complete
        ) {

          if (precondition() !== true) {

            complete();
            return null;

          }

          var fnDeferred = ensureDeferred(action);
          fnDeferred.callback(function (value) {

            var next = handle(value);

            if (postcondition() !== true) {

              complete();
              return null;

            }

            next();

          });
          fnDeferred.errback(defer.bind(state.deferred.fail, state.deferred));

        }

        function generateIter(
          state,
          precondition,
          action,
          handle,
          postcondition,
          complete
        ) {


          return defer.bind(
            iter,
            null,
            state,
            precondition,
            action,
            handle,
            postcondition,
            complete
          );

        }

        return {
          "ensureDeferred": ensureDeferred,
          "iter": iter,
          "generateIter": generateIter,
        };

      }());

      pkg.engine = engine;

      pkg.for = (function () {

        function loopComplete(state) {

          return state.offset < state.size;

        }

        function next(state, action, handle, counter, increment) {

          if (increment !== false) {

            state.offset = state.offset + 1;

          }

          return engine.generateIter(
            state,
            defer.bind(loopComplete, null, state),
            action,
            defer.bind(handle, null, counter + state.limit),
            defer.bind(loopComplete, null, state),
            defer.bind(state.deferred.resolve, state.deferred)
          );

        }

        function forEach(list, fn, limit) {

          var state = new State({"size": list.length, "limit": limit}),
            x;

          function handle(counter) {

            return next(
              state,
              defer.bind(
                fn,
                null,
                list[counter + state.limit],
                counter + state.limit,
                list
              ),
              defer.bind(handle, null, counter + state.limit),
              counter
            );

          }

          for (x = 0; x < state.limit; x = x + 1) {

            next(
              state,
              defer.bind(fn, null, list[x], x, list),
              defer.bind(handle, null, x),
              x,
              false
            )();

          }
          state.offset = x - 1;

          return state.deferred.promise();

        }

        function forIn(obj, fn, limit) {

          var state = new State({"limit": limit}),
            keys = [],
            key,
            x;

          for (key in obj) {

            if (obj.hasOwnProperty(key)) {

              keys.push(key);

            }

          }

          state.size = keys.length;

          function handle(counter) {

            return next(
              state,
              defer.bind(
                fn,
                null,
                obj[keys[counter + state.limit]],
                keys[counter + state.limit],
                obj
              ),
              defer.bind(handle, null, counter + state.limit),
              counter
            );

          }

          for (x = 0; x < state.limit; x = x + 1) {

            next(
              state,
              defer.bind(fn, null, obj[keys[x]], keys[x], obj),
              defer.bind(handle, null, x),
              x,
              false
            )();

          }
          state.offset = x - 1;

          return state.deferred.promise();

        }

        function forX(x, fn, limit) {

          var state = new State({"size": x, "limit": limit}),
            y;

          function handle(counter) {

            return next(
              state,
              defer.bind(
                fn,
                null,
                counter + state.limit
              ),
              defer.bind(handle, null, counter + state.limit),
              counter
            );

          }

          for (y = 0; y < state.limit; y = y + 1) {


            next(
              state,
              defer.bind(fn, null, y),
              defer.bind(handle, null, y),
              y,
              false
            )();

          }
          state.offset = x - 1;

          return state.deferred.promise();

        }

        return {
          'each': forEach,
          'in': forIn,
          'x': forX,
        };

      }());

      pkg.until = (function () {

        function untilFalse(test, fn, doUntil) {

          var state = new State();
          doUntil = !!doUntil || false;

          function handle() {

            if (doUntil === true) {

              return engine.generateIter(
                state,
                TRUE,
                fn,
                handle,
                test,
                defer.bind(state.deferred.resolve, state.deferred)
              );

            }

            return engine.generateIter(
              state,
              test,
              fn,
              handle,
              TRUE,
              defer.bind(state.deferred.resolve, state.deferred)
            );

          }

          handle()();

          return state.deferred.promise();

        }

        function untilTrue(test, fn, doUntil) {

          var state = new State();
          doUntil = !!doUntil || false;

          function handle() {

            if (doUntil === true) {

              return engine.generateIter(
                state,
                TRUE,
                fn,
                handle,
                function () {
                  return !test();
                },
                defer.bind(state.deferred.resolve, state.deferred)
              );

            }

            return engine.generateIter(
              state,
              function () {
                return !test();
              },
              fn,
              handle,
              TRUE,
              defer.bind(state.deferred.resolve, state.deferred)
            );

          }

          handle()();

          return state.deferred.promise();

        }

        return {
          "true": untilTrue,
          "false": untilFalse
        };

      }());

      pkg.map = function map(list, fn, limit) {

        var result = [],
          d = new Deferred(),
          loopD;

        loopD = pkg.for.each(list, function (item, idx) {

          var fnD = new Deferred(),
            value;

          value = pkg.engine.ensureDeferred(defer.bind(fn, null, item));
          value.callback(function (value) {

            result[idx] = value;
            fnD.resolve();

          });
          value.errback(function (reason) {

            fnD.fail(reason);

          });

          return fnD.promise();

        }, limit || 1);

        loopD.callback(function () {

          d.resolve(result);

        });

        loopD.errback(function (reason) {

          d.fail(reason);

        });

        return d.promise();

      };

      pkg.reduce = function reduce(list, fn, value) {

        var container = {"value": value},
          d = new Deferred(),
          loopD;

        loopD = pkg.for.each(list, function (item) {

          var fnD = new Deferred(),
            newValue;

          newValue = pkg.engine.ensureDeferred(
            defer.bind(fn, null, item, container.value)
          );
          newValue.callback(function (v) {

            container.value = v;
            fnD.resolve(v);

          });
          newValue.errback(function (reason) {

            fnD.fail(reason);

          });

          return fnD.promise();

        });

        loopD.callback(function () {

          d.resolve(container.value);

        });

        loopD.errback(function (reason) {

          d.fail(reason);

        });

        return d.promise();

      };

      pkg.select = function select(list, test) {

        var result = [],
          d = new Deferred(),
          loopD;

        loopD = pkg.map(list, test);
        loopD.callback(function (testList) {

          var x;
          for (x = 0; x < testList.length; x = x + 1) {

            if (testList[x] === true) {

              result.push(list[x]);

            }

          }

          d.resolve(result);

        });

        loopD.errback(function (reason) {

          d.fail(reason);

        });

        return d.promise();

      };

      pkg.remove = function remove(list, test) {

        var result = [],
          d = new Deferred(),
          loopD;

        loopD = pkg.map(list, test);
        loopD.callback(function (testList) {

          var x;
          for (x = 0; x < testList.length; x = x + 1) {

            if (testList[x] === false) {

              result.push(list[x]);

            }

          }

          d.resolve(result);

        });

        loopD.errback(function (reason) {

          d.fail(reason);

        });

        return d.promise();

      };

      pkg.all = function all(list, test) {

        var d = new Deferred(),
          loopD;

        loopD = pkg.remove(list, test);
        loopD.callback(function (newList) {

          d.resolve(newList.length === 0);

        });

        loopD.errback(function (reason) {

          d.fail(reason);

        });

        return d.promise();

      };

      pkg.none = function none(list, test) {

        var d = new Deferred(),
          loopD;

        loopD = pkg.select(list, test);
        loopD.callback(function (newList) {

          d.resolve(newList.length === 0);

        });

        loopD.errback(function (reason) {

          d.fail(reason);

        });

        return d.promise();

      };

      return pkg;

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
