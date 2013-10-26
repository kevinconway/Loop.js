===============================
Loop.js -- Helpers Documentation
================================

.. contents::

Description
===========

The helpers module is a set of utilities used internally by the Loop.js
package. These utilities have been made available to developers in case they
are of any use.

Usage Examples
==============

Binding Function Calls
----------------------

For browser backwards compatibility reasons, the JavaScript `.bind` method
cannot be used. The `apply` helper can be used to simulate the same behaviour::

    var boundLogger = helpers.apply(console.log, 'Bound.');

    boundLogger();

    // Console Output: Bound.

Wrap With Deferred
------------------

Internally, all iterators expect to receive a deferred from an iteration. To
guarantee this behaviour the `execute` helper will wrap function results in
a deferred::

    var sillyFn = function () {
        return 1234;
    },
    d;

    d = helpers.execute(sillyFn);

    d.callback(function (value) {
        console.log(value);
    });

    // Console Output: 1234


API Reference
=============

Exports
-------

This module exports a single object. When required in a Node.js or AMD
environment, the `helpers` object will be the only value::

    var helpers = require('loopjs/loop/helpers');

    typeof helpers === "object"; // true

In vanilla, browser environments the `helpers` module is injected into the
global `loop` namespace::

    typeof loop.helpers === "object"; // true

apply(fn [, arg1[, arg2[, ...]]])
---------------------------------

Returns a new function which, when called, will call `fn` with the given args.

execute(fn)
-----------

Return a deferred that resolves to the return value of `fn`. If `fn` returns
a deferred then the value resolved by that deferred will be used to resolve
the returned deferred.
