=======
Loop.js
=======

**Cross platform async helpers for JavaScript.**

.. image:: https://travis-ci.org/kevinconway/Loop.js.png?branch=master
    :target: https://travis-ci.org/kevinconway/Loop.js
    :alt: Current Build Status

What Is Loop?
===============

Loop is a utility designed to help developers make better use of
the JavaScript concurrency model. Loop provides a set of functions that
replace synchronous looping with asynchronous looping.

All loops return a Deferred object that is resolved when the loop is completed.

Show Me
=======

.. code-block:: javascript

    var list = [1, 2, 3, 4, 5],
        fn = function (value) {

            return value * 2;
        },
        d;

    d = loopjs.map(list, fn);
    d.callback(function (newList) {
        console.log(newList); // [2, 4, 6, 8, 10]
    });

Currently supported iterations are:

    for.each, for.in, for.x, until.false, until.false, map, reduce, select,
    remove, find, all, and none.

For detailed API and usage documentation for each iterator see the doc
directory.

Setup
=====

Node.js
-------

This package is published through NPM under the name `loopjs`::

    $ npm install loopjs

Once installed, simply `loopjs = require("loopjs")`.

Browser
-------

Developers working with a normal browser environment can use regular script
tags to load the package. This package has dependencies on these other
packages:

-   `Modelo <https://github.com/kevinconway/Modelo.js>`_

-   `Defer <https://github.com/kevinconway/Defer.js>`_

-   `Deferred <https://github.com/kevinconway/Deferred.js>`_

The load order should be something like this::

    <script src="modelo.js"></script>
    <script src="defer.js"></script>
    <script src="deferred.js"></script>
    <script src="loop.js"></script>

The package loads into a global variable named `loopjs`.

Tests
-----

To run the tests in Node.js use the `npm test` command.

To run the tests in a browser, run the `install_libs` script in the test
directory and then open the `runner.html` in the browser of your choice.

License
=======

Loop
-----

This project is released and distributed under an MIT License.

::

    Copyright (C) 2014 Kevin Conway

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.

Contributors
============

Style Guide
-----------

All code must validate against JSlint.

Testing
-------

Mocha plus expect. All tests and functionality must run in Node.js and the
browser.

Contributor's Agreement
-----------------------

All contribution to this project are protected by the contributors agreement
detailed in the CONTRIBUTING file. All contributors should read the file before
contributing, but as a summary::

    You give us the rights to distribute your code and we promise to maintain
    an open source release of anything you contribute.
