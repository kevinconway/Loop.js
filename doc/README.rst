=======
Loop.js
=======

.. contents::

Description
===========

The Loop.js package contains iterators which process which help when attempting
to apply async functions across a list of values.

Every iterator returns a deferred rather than accepting a callback.


Usage Examples
==============

Simple Example
--------------

A simple, if not degenerate, example of an iterator using for.each::

    var list = [0, 1, 2, 3, 4, 5],
        fn = function (item) {
            console.log(item);
        },
        d;

    // Perform `fn` for each item in `list`.
    d = loopjs.for.each(list, fn);

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
iteration is simply a wrapper around a simple for loop. One detail to note is
that the iterator returns a deferred. This deferred can have callbacks and
errbacks attached that will trigger once the iteration is complete. The
deferred implementation used is the Defer.js module.

Another important detail to note is that this form of looping, when the
function being executed is a sequential function, is necessarily slower than
if a normal for loop was used. The real utility of this library is in applying
it with async functions that return deferreds.

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
promise is resolved the iterator is free to move on to the next iteration.

This provides developers with a platform for integrating complex or
long-running behaviour into a different forms of iteration.

API Reference
=============

Exports
-------

::

    var loopjs = require('loopjs');

    typeof loopjs === "object"; // true
    typeof loopjs.for.each === "function"; // true
    typeof loopjs.for.in === "function"; // true
    typeof loopjs.for.x === "function"; // true
    typeof loopjs.until.true === "function"; // true
    typeof loopjs.until.false === "function"; // true
    typeof loopjs.map === "function"; // true
    typeof loopjs.reduce === "function"; // true
    typeof loopjs.select === "function"; // true
    typeof loopjs.remove === "function"; // true
    typeof loopjs.all === "function"; // true
    typeof loopjs.none === "function"; // true

In browser environments the global `loopjs` object is available::

    typeof loopjs === "object"; // true
    typeof loopjs.for.each === "function"; // true
    typeof loopjs.for.in === "function"; // true
    typeof loopjs.for.x === "function"; // true
    typeof loopjs.until.true === "function"; // true
    typeof loopjs.until.false === "function"; // true
    typeof loopjs.map === "function"; // true
    typeof loopjs.reduce === "function"; // true
    typeof loopjs.select === "function"; // true
    typeof loopjs.remove === "function"; // true
    typeof loopjs.all === "function"; // true
    typeof loopjs.none === "function"; // true

for.each(list, fn, limit)
-------------------------

Perform `fn` for each item in `list`. `fn` is passed the current list
value, current list offset, and a reference to `list` as arguments. The `limit`
argument is the maximum number of concurrent calls to `fn` that should be used.

for.in(obj, fn, limit)
----------------------

Perform `fn` for each key in obj. `fn` is passed the current object value,
current key, and a reference to `obj` as parameters. The `limit` argument is
the maximum number of concurrent calls to `fn` that should be used.

for.x(x, fn, limit)
-------------------

Perform `fn` `x` times. `fn` is passed the current `x` as a parameter. The
`limit` argument is the maximum number of concurrent calls to `fn` that should
be used.

until.false(test, fn, doUntil)
------------------------------

Perform `fn` until `test` returns `false`. Pass `true` for `doUntil` to use a
do-while loop instead of a while loop.

untilTrue(test, fn, doUntil)
----------------------------

Perform `fn` until `test` returns `true`. Pass `true` for `doUntil` to use a
do-while loop instead of a while loop.

map(list, fn, limit)
-------------

Perform `fn` on each item in `list` to generate a new list containing the
return values from `fn`. `fn` is passed the current list value as a
parameter. The `limit` argument is the maximum number of concurrent calls to
`fn` that should be used.

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

all(list, test)
---------------

Resolves to `true` when every element of `list` produces `true` when
given to `test`. Otherwise resolves to `false`.

none(list, test)
----------------

Resolves to `true` when every element of `list` produces `false` when
given to `test`. Otherwise resolves to `false`.
