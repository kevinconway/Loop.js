=======
Loop.js
=======

**Cross platform async helpers.**

.. image:: https://travis-ci.org/kevinconway/Loop.js.png?branch=master
    :target: https://travis-ci.org/kevinconway/Loop.js
    :alt: Current Build Status

What Is Loop?
=============

Loop is a utility designed to make it easier to run async functions in a loop.
All loops return an A+ compliant promise that is resolved when the loop is
completed.

Show Me
=======

.. code-block:: javascript

    var list = [1, 2, 3, 4, 5],
        asyncDouble = function (value) {
            // Any A+ compliant promise will work.
            var promise = new SomePromiseImplementation();
            // Do something async and resolve the promise with a value.
            setImmediate(promise.resolve.bind(promise, value * 2));
            return promise;
        };

    loopjs.map(list, asyncDouble).then(function (newList) {
        console.log(newList); // [2, 4, 6, 8, 10]
    });

Currently supported iterations are:

    for.each, for.in, for.x, until.true, until.false, map, reduce, select,
    remove, find, all, and none.

For more use cases, examples, and API documentation see the 'doc' directory.

Setup
=====

Node.js
-------

This package is published through NPM under the name `loopjs`::

    $ npm install loopjs

Once installed, `loopjs = require("loopjs")`.

Browser
-------

This module uses browserify to create a browser compatible module. The default
grunt workflow for this project will generate both a full and minified browser
script in a build directory which can be included as a <script> tag::

    <script src="loop.browser.min.js"></script>

The package is exposed via the global name `loopjs`.

Tests
-----

Running the `npm test` command will kick off the default grunt workflow. This
will lint using jslint, run the mocha/expect tests, generate a browser module,
and test the browser module using PhantomJS.

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
