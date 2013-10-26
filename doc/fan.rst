============================
Loop.js -- Fan Documentation
============================

.. contents::

Description
===========

The fan module of the Loop.js package contains iterator which process all items
at once* and in no guaranteed order**. Every fan iterator returns a deferred
rather than accepting a callback.

Let's talk about those asterisks.

First, the claim that all items are processed at once sounds as though the
iterator will process the iterations in parallel. That is not entirely
accurate. JavaScript, as a language, is single threaded. There is not such a
thing as parallel computation within a JavaScript process. However, if an
application needs to launch 100 AJAX requests, for example, then fanning those
requests out may be of benefit. If you are using the fan module in an attempt
to simultaneously process multiple CPU bound functions *it will not work*.

Second, the claim that there is no guaranteed order to the execution is not a
guarantee that the iteration will not be executed in the same order every time.
The order of processing for the iterations is dependent upon the underlying
implementation of the Defer.js module used as well as the implementation of the
JavaScript engine on which the code is running. For the most part, the Node.js
`process.nextTick` and the browser `window.postMessage` appear to process
deferred methods in the order that they were deferred. This behaviour could
change at any time, however, and should not be relied upon.

Usage Examples
==============

Simple Example
--------------

All iterator functions accept some function that is applied at each step in the
iterations. If these user supplied functions return a deferred then the
iterator will automatically handle that deferred.

    var list = [0, 1, 2, 3, 4, 5],
        asyncFn = function (item) {
            var deferred = new Deferred(),
                logAndResolve,
                randomize;

            logAndResolve = function () {
                console.log(item);
                deferred.resolved();
            };

            randomize = function () {
                setTimeout(logAndResolve, Math.random() * 30);
            };

            defer(randomize);

            return deferred.promise();
        },
        d;

    // Perform `fn` for each item in `list`.
    d = forEach(list, fn);

    d.callback(function () {
        console.log("Done.");
    })

    // Console Output: 3
    // Console Output: 0
    // Console Output: 1
    // Console Output: 4
    // Console Output: 2
    // Console Output: 5
    // Console Output: Done.

In the above example each iteration logs a value at some randomized time the
future. While trivial, this example is intended to illustrate how the fan
iterators can manage iterations with indeterminate wait time (such as AJAX
calls). Here a deferred is returned to allow the forEach iterator to manage
waiting for the results. Once all deferred objects are resolved the callback
is issued.

As was stated in the introduction, the fan iterators are only useful when
managing iterations with non-blocking wait times. Good examples of non-blocking
waits would be network IO and waiting for events to trigger.

API Reference
=============

Exports
-------

This module exports a single object. When required in a Node.js or AMD
environment, the `fan` object will be the only value::

    var fan = require('loopjs/loop/fan');

    typeof fan === "object"; // true

In vanilla, browser environments the `fan` module is injected into the
global `loop` namespace::

    typeof loop.fan === "object"; // true

forEach(list, fn)
-----------------

Perform `fn` for each item in `list`. `fn` is passed the current list
value, current list offset, and a reference to `list` as arguments.

forIn(obj, fn)
--------------

Perform `fn` for each key in obj. `fn` is passed the current object value,
current key, and a reference to `obj` as parameters.

forX(x, fn)
-----------

Perform `fn` `x` times. `fn` is passed the current `x` as a parameter.

map(list, fn)
-------------

Perform `fn` on each item in `list` to generate a new list containing the
return values from `fn`. `fn` is passed the current list value as a
parameter.

The promise returned by `map` will contain the the resulting list when it is
resolved.

select(list, test)
------------------

Perform `test` for each item in `list` and generate a new list containing
only the values from `list` for which `test` returned `true`.

The promise returned by `select` will contain the the resulting list when it is
resolved.

remove(list, test)
------------------

Perform `test` for each item in `list` and generate a new list containing
only the values from `list` for which `test` returned `false`.

The promise returned by `remove` will contain the the resulting list when it is
resolved.

find(list, test)
----------------

Return the the first value of `list` for which `test` returns a `true`.

The promise returned by `find` will contain the the resulting value when it is
resolved. The value will be `undefined` if not found.

all(list, test)
---------------

Resolves to `true` when every element of `list` produces `true` when
given to `test`. Otherwise resolves to `false`.

none(list, test)
----------------

Resolves to `true` when every element of `list` produces `false` when
given to `test`. Otherwise resolves to `false`.

join(list, fn)
--------------

Performs `fn` for each item in `list`. Resolves to a single list containing
all of the return values from `fn`. This method differs from `map` in that
all return values from `fn` are joined together in a flat list using
`Array.prototype.concat`.

The promise returned by `join` will contain the the resulting list when it is
resolved.
