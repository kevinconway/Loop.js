=======
Loop.js
=======

**Cross platform async helpers for JavaScript.**

*Status: In Development*

What Is Loop?
===============

Loop is a utility designed to help developers make better use of
the JavaScript concurrency model. Loop provides a set of functions that
replace synchronous looping with asynchronous looping.

All loops return a Deferred object that is resolved when the loop is completed.

Loops can process sequentially (one item then the next), fanned (all items
processed concurrently), or batched (up to N items processed concurrently).

Status
======

Loop is still under development. Currently the sequential and fan modules are
complete and tested. Below are the implemented loops along with which loop
types they support.

-   forEach(list, fn)

    Perform `fn` for each item in `list`. `fn` is passed the current list value,
    current list offset, and a reference to `list` as arguments.

    Supports sequential and fan.

-   forIn(obj, fn)

    Perform `fn` for each key in obj. `fn` is passed the current object value,
    current key, and a reference to `obj` as parameters.

    Supports sequential and fan.

-   forX(x, fn)

    Perform `fn` `x` times. `fn` is passed the current `x` as a parameter.

    Supports sequential and fan.

-   untilFalse(test, fn)

    Perform `fn` until `test` returns `false`.

    Supports sequential.

-   doUntilFalse(test, fn)

    Perform `fn` until `test` returns `false`. `fn` is always run at least once.

    Supports sequential.

-   untilTrue(test, fn)

    Perform `fn` until `test` returns `true`.

    Supports sequential.

-   doUntilTrue(test, fn)

    Perform `fn` until `test` returns `true`. `fn` is always run at least once.

    Supports sequential.

-   map(list, fn)

    Perform `fn` on each item in `list` to generate a new list containing the
    return values from `fn`. `fn` is passed the current list value as a
    parameter.

    Supports sequential and fan.

-   reduce(list, fn, value)

    Perform `fn` on each item in `list` to produce a single value. `value`
    represents the initial value state. `value` is repeatedly set to the return
    of `fn`. `fn` is passed the current list item and `value` as parameters.

    Supports sequential.

-   select(list, test)

    Perform `test` for each item in `list` and generate a new list containing
    only the values from `list` for which `test` returned `true`.

    Supports sequential and fan.

-   remove(list, test)

    Perform `test` for each item in `list` and generate a new list containing
    only the values from `list` for which `test` returned `false`.

    Supports sequential and fan.

-   find(list, test)

    Return the the first value of `list` for which `test` returns a `true`.

    Supports sequential and fan.

-   all(list, test)

    Resolves to `true` when every element of `list` produces `true` when
    given to `test`. Otherwise resolves to `false`.

    Supports sequential and fan.

-   none(list, test)

    Resolves to `true` when every element of `list` produces `false` when
    given to `test`. Otherwise resolves to `false`.

    Supports sequential and fan.

-   join(list, fn)

    Performs `fn` for each item in `list`. Resolves to a single list containing
    all of the return values from `fn`. This method differs from `map` in that
    all return results from `fn` are joined together in a flat list using
    `Array.prototype.concat`.

    Supports sequential and fan.


Show Me
=======

::

    var list = [1, 2, 3, 4, 5],
        fn = function (value) {

            return value * 2;
        },
        d;

    d = loop.sequential.map(list, fn);
    d.callback(function (newList) {
        console.log(newList); // [2, 4, 6, 8, 10]
    });

    d = loop.fan.map(list, fn);
    d.callback(function (newList) {
        console.log(newList); // [2, 4, 6, 8, 10]
    });


License
=======

Loop
-----

This project is released and distributed under an MIT License.

::

    Copyright (C) 2013 Kevin Conway

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to
    deal in the Software without restriction, including without limitation the
    rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
    sell copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
    IN THE SOFTWARE.

Contributors
============

Style Guide
-----------

This library needs to be not only cross-platform compatible but also backwards
compatible as much as possible when it comes to browser environments. For this
reason, all code in this repository must validate with JSLint.

Testing
-------

Test coverage is essential to backing up the claim that this library is
compatible across all JavaScript environments. Unit tests are this repository's
guarantee that all components function as advertised in the environment. For
this reason, all code this repository must be tested using the chosen unit
testing library: Mocha.js. The chosen assertion library to use with Mocha
for this project is Expect.js. Mocha and Expect have been chosen for their
cross-platform compatibility.

For convenience and portability, both Mocha and Express are included in this
repository. For further convenience, browser based test runners have also been
included for both <script> and AMD loading.

Contributor's Agreement
-----------------------

All contribution to this project are protected by the contributors agreement
detailed in the CONTRIBUTING file. All contributors should read the file before
contributing, but as a summary::

    You give us the rights to distribute your code and we promise to maintain
    an open source release of anything you contribute.
