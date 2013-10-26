======================
Loop.js Documentation
======================

.. contents::

Description
===========

The Loop.js library is a set of functions which enable developers to more
easily write asynchronous iterators.

The Loop.js package is made up of four modules which are:

-   sequential

    Loops which process items one at a time.

-   fan

    Loops which process all items at once.

-   batch

    Loops which process a given number of items at a time.

-   helpers

    Utility functions used by loops.


Usage Examples
==============

For usage examples, see the individual module documentation.


API Reference
=============

Exports
-------

This module exports a several objects. When required in a Node.js or AMD
environment, the `loop` object will be returned with submodules attached::

    var loop = require('loop');

    typeof loop === "object"; // true
    typeof loop.batch === "object"; // true
    typeof loop.fan === "object"; // true
    typeof loop.sequential === "object"; // true
    typeof loop.helpers === "object"; // true

In vanilla, browser environments the `loop` function is injected into the
global namespace::

    typeof loop === "object"; // true
    typeof loop.batch === "object"; // true
    typeof loop.fan === "object"; // true
    typeof loop.sequential === "object"; // true
    typeof loop.helpers === "object"; // true
