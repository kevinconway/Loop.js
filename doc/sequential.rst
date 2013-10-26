===================================
Loop.js -- Sequential Documentation
===================================

.. contents::

Description
===========

The sequential module of the Loop.js package contains iterators which process
items one at a time. The benefit to using the sequential module for iteration
versus simple looping in JavaScript is that it automatically handles waiting
for asynchronous resources.

Every sequential iterator returns a deferred rather than accepting a callback.


Usage Examples
==============

Simple Example
--------------

A simple, if not degenerate, example of a sequential iterator using forEach::

    var list = [0, 1, 2, 3, 4, 5],
        fn = function (item) {
            console.log(item);
        },
        d;

    // Perform `fn` for each item in `list`.
    d = forEach(list, fn);

    d.callback(function () {
        console.log("Done.");
    })

    // Console Output: 0
    // Console Output: 1
    // Console Output: 2
    // Console Output: 3
    // Console Output: 4
    // Console Output: 5
    // Console Output: Done.

In the above example, our function used by the iteration is a simple,
synchronous function that logs the input to the console. In this case the
sequential iteration is simply a wrapper around a simple for loop. One detail
to note is that the iterator returns a deferred. This deferred can have
callbacks and errbacks attached that will trigger once the iteration is
complete.

The real utility of sequential looping, however, is found when asynchronous
functionality is involved.

Async Example
-------------

All iterator functions accept some function that is applied at each step in the
iterations. If these user supplied functions return a deferred then the
iterator will wait for that deferred to resolve before continuing on to the
next iteration::

    var list = [0, 1, 2, 3, 4, 5],
        asyncFn = function (item) {
            var deferred = new Deferred();

            defer(function() {
                console.log(item);
                deferred.resolve()
            });

            return deferred.promise();
        },
        d;

    // Perform `fn` for each item in `list`.
    d = forEach(list, fn);

    d.callback(function () {
        console.log("Done.");
    })

    // Console Output: 0
    // Console Output: 1
    // Console Output: 2
    // Console Output: 3
    // Console Output: 4
    // Console Output: 5
    // Console Output: Done.

Again, this example is a gross simplification but it illustrates the iterators'
integration with deferred objects. The async logging function return a promise
that is not resolved until some time in the indefinite future. Once that
promise is resolved the iterator is free to process the iteration.

This provides developers with a platform for integrating complex or
long-running behaviour into a sequential iteration.

API Reference
=============

Exports
-------

This module exports a single object. When required in a Node.js or AMD
environment, the `sequential` object will be the only value::

    var sequential = require('loopjs/loop/sequential');

    typeof sequential === "object"; // true

In vanilla, browser environments the `sequential` module is injected into the
global `loop` namespace::

    typeof loop.sequential === "object"; // true

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

untilFalse(test, fn)
--------------------

Perform `fn` until `test` returns `false`.

doUntilFalse(test, fn)
----------------------

Perform `fn` until `test` returns `false`. `fn` is always run at least
once.

untilTrue(test, fn)
-------------------

Perform `fn` until `test` returns `true`.

doUntilTrue(test, fn)
---------------------

Perform `fn` until `test` returns `true`. `fn` is always run at least once.

map(list, fn)
-------------

Perform `fn` on each item in `list` to generate a new list containing the
return values from `fn`. `fn` is passed the current list value as a
parameter.

The promise returned by `map` will contain the the resulting list when it is
resolved.

reduce(list, fn, value)
-----------------------

Perform `fn` on each item in `list` to produce a single value. `value`
represents the initial value state. `value` is repeatedly set to the return
of `fn`. `fn` is passed the current list item and `value` as parameters.

The promise returned by `reduce` will contain the the resulting value when it
is resolved.

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
