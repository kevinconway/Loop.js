==============================
Loop.js -- Batch Documentation
==============================

.. contents::

Description
===========

The batch module of the Loop.js package is very similar to the fan module.
Where the fan module processes all items at once, however, the batch module
processing N number of items at a time*. Every batch iterator returns a
deferred rather than accepting a callback.

Let's talk about that asterisk.

The claim that N number of items are processed at once sounds as though the
iterations will be processed in parallel. That is not entirely accurate.
JavaScript, as a language, is single threaded. There is not such a thing as
parallel computation within a JavaScript process. However, if an application
needs to launch 100 AJAX requests to a service that limits the number of
simultaneous connections, for example, then batching those requests out may be
of benefit. If you are using the batch module in an attempt to simultaneously
process multiple CPU bound functions *it will not work*.

Usage Examples
==============

Simple Example
-------------

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
    d = forEach(list, fn, 2);

    d.callback(function () {
        console.log("Done.");
    })

    // Console Output: 1
    // Console Output: 0
    // Console Output: 2
    // Console Output: 3
    // Console Output: 5
    // Console Output: 4
    // Console Output: Done.

In the above example each iteration logs a value at some randomized time the
future. While trivial, this example is intended to illustrate how the batch
iterators can manage iterations with indeterminate wait time (such as AJAX
calls). Here a deferred is returned to allow the forEach iterator to manage
waiting for the results. Once all deferred objects are resolved the callback
is issued.

Unlike the fan module, the batch module only processes N number of iterations
at a time. In this example, the batch size chosen is two. This means that at
any given time there are only two iterations in flight. The batch module does
not wait for both to finish before moving on to the next pair. Instead, as
soon as a spot is available in the batch the iterator will check out the next
iteration and begin processing it.

API Reference
=============

Exports
-------

This module exports a single object. When required in a Node.js or AMD
environment, the `batch` object will be the only value::

    var batch = require('loopjs/loop/batch');

    typeof batch === "object"; // true

In vanilla, browser environments the `batch` module is injected into the
global `loop` namespace::

    typeof loop.batch === "object"; // true

forEach(list, fn, limit)
------------------------

Perform `fn` for each item in `list`. `fn` is passed the current list
value, current list offset, and a reference to `list` as arguments.

forIn(obj, fn, limit)
---------------------

Perform `fn` for each key in obj. `fn` is passed the current object value,
current key, and a reference to `obj` as parameters.

forX(x, fn, limit)
------------------

Perform `fn` `x` times. `fn` is passed the current `x` as a parameter.

map(list, fn, limit)
--------------------

Perform `fn` on each item in `list` to generate a new list containing the
return values from `fn`. `fn` is passed the current list value as a
parameter.

The promise returned by `map` will contain the the resulting list when it is
resolved.

select(list, test, limit)
-------------------------

Perform `test` for each item in `list` and generate a new list containing
only the values from `list` for which `test` returned `true`.

The promise returned by `select` will contain the the resulting list when it is
resolved.

remove(list, test, limit)
-------------------------

Perform `test` for each item in `list` and generate a new list containing
only the values from `list` for which `test` returned `false`.

The promise returned by `remove` will contain the the resulting list when it is
resolved.

find(list, test, limit)
-----------------------

Return the the first value of `list` for which `test` returns a `true`.

The promise returned by `find` will contain the the resulting value when it is
resolved. The value will be `undefined` if not found.

all(list, test, limit)
----------------------

Resolves to `true` when every element of `list` produces `true` when
given to `test`. Otherwise resolves to `false`.

none(list, test, limit)
-----------------------

Resolves to `true` when every element of `list` produces `false` when
given to `test`. Otherwise resolves to `false`.

join(list, fn, limit)
---------------------

Performs `fn` for each item in `list`. Resolves to a single list containing
all of the return values from `fn`. This method differs from `map` in that
all return values from `fn` are joined together in a flat list using
`Array.prototype.concat`.

The promise returned by `join` will contain the the resulting list when it is
resolved.
