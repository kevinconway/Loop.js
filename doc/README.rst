=======
Loop.js
=======

.. contents::

Description
===========

The Loop.js package contains iterators which help when attempting to apply
async functions across a list of values.

Every iterator returns a promise rather than accepting a callback.

Usage Examples
==============

Simple Example
--------------

A simple, if not degenerate, example of an iterator using for.each:

.. code-block:: javascript

    var list = [0, 1, 2, 3, 4, 5],
        fn = function (item) {
            console.log(item);
        },
        p;

    // Perform `fn` for each item in `list`.
    p = loopjs.for.each(list, fn);

    p.then(function () {
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
iteration is simply a wrapper around a for loop. One detail to note is
that the iterator returns a promise, or thenable.

Another important detail to note is that this form of looping, when the
function being executed is a sequential function, is necessarily slower than
if a normal for loop was used. The real utility of this library is in applying
it with async functions that return promises.

Async Example
-------------

All iterator functions accept some function that is applied at each step in the
iterations. If these user supplied functions return a promise then the
iterator will wait for that promise to resolve before continuing on to the
next iteration. The example here will use the Deferred.js implementation of
promises. However, any A+ compliant promise will work.

.. code-block:: javascript

    var list = [0, 1, 2, 3, 4, 5],
        asyncFn = function (item) {
            var deferred = new Deferred();

            setImmediate(function () {
                console.log(item);
                deferred.resolve()
            });

            return deferred.promise();
        };

    // Perform `fn` for each item in `list`.
    loopjs.for.each(list, fn).then( function () { console.log("Done."); });

    // Console Output: 0
    // Console Output: 1
    // Console Output: 2
    // Console Output: 3
    // Console Output: 4
    // Console Output: 5
    // Console Output: Done.

Again, this example is a gross simplification but it illustrates the iterators'
integration with promises. The "async" logging function return a promise
that is not resolved until some time in the indefinite future. Once that
promise is resolved the iterator is free to move on to the next iteration.

Batching
--------

Each of the loops that mimic `for` loop functionality have the option of
processing multiple items concurrently. To batch a `for` iterator simply pass
in the concurrency level as the third parameter:

.. code-block:: javascript

    var list = [0, 1, 2, 3, 4, 5, 6, 7],
        fn = function (item) {
            var deferred = new Deferred();

            setTimeout(function () {
                console.log(item);
                deferred.resolve();
            }, Math.random() * 1000);

            return deferred.promise();
        };

    loopjs.for.each(list, fn, 4).then( function () { console.log("Done."); });

    // Console Output: 2
    // Console Output: 0
    // Console Output: 3
    // Console Output: 1
    // Console Output: 7
    // Console Output: 5
    // Console Output: 4
    // Console Output: 6
    // Console Output: Done.

In this example the loop only ever has four unresolved promises at any given
time. As a promise resolves, it moves on to the next item in the list. Batching
in this way is useful any time the async function being run uses some form of
network connection for which you want to control or configure the concurrency.

Until Loops
-----------

While different kinds of `for` loops are useful they are by no means the only
kind of looping that can be done. This package also provides the equivalent of
`while` and `do-while` loops:

.. code-block:: javascript

    function checkIfReady() {

        return asyncGetResourceStatus().then(function (status) {
            return status === 'ready';
        });

    }

    loopjs.until.true(checkIfReady, console.log.bind(null, 'Waiting...')).then(
        console.log.bind(null, 'Resource is ready.')
    );

    // Console Output: Waiting...
    // Console Output: Waiting...
    // Console Output: Waiting...
    // ...
    // Console Output: Resource is ready.

This example is a little dense so let's wade through it.

First we have our async test function which returns a promise. The idea behind
the `asyncGetResourceStatus` method is that we have some resource in another
service that we can poll the status of. We get that status and compare it
against a known, good status (ready). If the status is not ready our promise
resolves to `false`. Once it is ready our promise resolves to `true`. This will
be used as the condition for our `while` loop.

Next we run the `until.true` loop. This loop will continuously run the
`checkIfReady` test to determine when to stop. At each iteration where
`checkIfReady` resolves to false the loop will run the given function
(console.log in this case). Once the test returns `true` the loop promise
resolves.

These types of loops are most useful for polling external resources until some
condition is met and then performing some action. This package contains an
`until.true` and `until.false` loop. To simulate a `do-while` loop simply pass
`true` in as an optional third parameter.

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
