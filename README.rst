=======
Loop.js
=======

**Cross platform async helpers for Javascript.**

*Status: In Development*

What Is Loop?
===============

Loop is a utility designed to help developers make better use of
the JavaScript concurrency model. Loops provides a set of functions that
replace synchronous looping with asynchronous looping.

All loops return a Deferred object that is resolved when the loop is complete.

Status
======

Loop is still in early development.

Currently supported loops are:

-   sequential(fn, fn, fn, ...)

    Perform each function given in order. Each function runs after the
    previous has completed. If a function returns a deferred the loop will
    wait until that deferred is resolved before continuing.

    -   forEach(list, fn)

        Perform `fn` for each item in the list. If `fn` returns a deferred
        then the loop waits for the deferred to resolve before continuing.

    -   forIn(obj, fn)

        Perform `fn` for each native property in the object. This loop
        utilizes a filtered for-in loop. If `fn` returns a deferred then the
        loop will wait until that deferred is resolved before continuing.

    -   chain(fn, fn, fn, ...)

        Perform each function in the list where each function receives the
        input of the function that ran just before it. The first function in
        the list is run without input. If any function in the list returns a
        deferred then the loop will wait for that deferred to resolve before
        continuing. The value resolved by the deferred will be passed in as
        input to the next function. The value returned by the last function
        will be the value used to resolve the deferred returned by a call to
        this function.

Still to come are similar looping functions that fan out. That is, they queue
up all functions for all items in the list at the same time. These functions
would be primarily for developers who need to lunch a series of functions
that all leverage some form of non-blocking IO.

Show Me
=======

*Examples pending.*

Setup Instructions
==================

This library is designed from the beginning to operate in as many JavaScript
environments as possible. To accomplish this, all modules have been wrapped in
a specialized module pattern that will detect the current environment and
choose the most appropriate loading mechanism.

Currently support platforms are Node.js, browser via <script>, and AMD via
RequireJS.

Node.js
-------

This package is published through NPM under the name `loopjs` and can be
installed with::

    $ npm install loopjs

This should automatically install all dependencies (deferjs and deferredjs).

This package can then be loaded with `require('loopjs')`.

Browser (<script>)
------------------

Developers working with a normal browser environment can use regular script
tags to load the package. This package has dependencies on these other
packages:

-   `Modelo <https://github.com/kevinconway/Modelo.js>`_

-   `Defer <https://github.com/kevinconway/Defer.js>`_

-   `Event <https://github.com/kevinconway/Event.js>`_

-   `Deferred <https://github.com/kevinconway/Deferred.js>`_

The load order should be something like this::

    <script src="modelo.js"></script>
    <script src="defer.js"></script>
    <script src="event.js"></script>
    <script src="deferred.js"></script>
    <script src="loop.js"></script>

The package loads into a global variable named `Loop`.

Browser (AMD)
-------------

Developers working with RequireJS can also load this package with `require()`.

One thing to note, however, is that this package has its own dependencies that
must also be available through `require()`. Developers with NPM installed can
make use of the pre-configured dependency options by doing the following::

    $ npm install deferredjs
    $ cd node_modules/deferredjs/node_modules/eventjs
    $ npm install
    $ cd ../../../eventjs
    $ npm install

Now when you reference `loopjs` as a dependency it should properly load
its own dependencies.

If you require something more specific then you can edit the dependency options
for this package by looking for the following line 33 which should be::

    amd: ['./node_modules/deferjs/defer.js',
            './node_modules/deferredjs/deferred.js'],

Simply change these paths to match where you have placed the corresponding
files.

License
=======

Loop
-----

This project is released and distributed under an MIT License.

::

    Copyright (C) 2012 Kevin Conway

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

Mocha and Expect
----------------

Mocha and Expect are included with this repository for convenience. Both
libraries are distributed by their original authors under the MIT license.
Each library contains the full license text and original copyright notice.

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

Commit Messages
---------------

All commit messages in this repository should conform with the commit message
pattern detailed in
`this document <https://github.com/StandardsDriven/Repository>`_.

Contributor's Agreement
-----------------------

All contribution to this project are protected by the contributors agreement
detailed in the CONTRIBUTING file. All contributors should read the file before
contributing, but as a summary::

    You give us the rights to distribute your code and we promise to maintain
    an open source release of anything you contribute.
