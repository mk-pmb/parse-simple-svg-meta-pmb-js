
<!--#echo json="package.json" key="name" underline="=" -->
parse-simple-svg-meta-pmb
=========================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Given the source of a simple SVG image, find basic info about its outermost
SVG tag.
<!--/#echo -->


Not an XML parser
-----------------

This package is not supposed to be an XML parser.
It can understand only a very simple subset of SVG.
The intent is to limit complexity low enough to allow
using very defensive RegExps for parsing.
The downside of this simplicity is that any fancy shenanigans in the
SVG code will cause the parser to just give up and return failure.

Examples of what's NOT supported:

* ⛔ Namespaces on tags
* ⛔ Anything about hierarchy or closing tags
* ⛔ Reliable detection of malformed tags.
* ⛔ Characters outside the Basic Latin block.
* ⛔ Most control characters in the Basic Latin block.
* ⛔ Reliably preserving whitespace in attribute values.
* ⛔ Character entities (e.g. `&quot;` or `&#39;`)
* ⛔ Length units other than `px` and user units.
* ⛔ User units other than pixels.
* ⛔ Lengths less than or equal to zero.



API
---

This module exports one function:

### findSvgMeta(svg)

`svg` is the source code of your image as a string.

<!-- !
`opt` must be either a Boolean (ignored) or an options object that
supports these optional keys:

* `vpw`: SVG viewport width. This should be a positive number.
  Not currently used.
* `vph`: Like `vpw` but for height.
! -->

Returns `false` on failure.
Otherwise, returns a dictionary object with at least these properties:

* `widthPx`, `widthFrac`, `heightPx`, `heightFrac`: Dimensions of the image.
  * If a dimension is given as absolute length, its `…Px` value will be set
    accordingly, and its `…Frac` value will be `0`.
  * If a dimension is given as percentage, its `…Frac` value will be set to
    the fraction represented by the percentage, e.g. `"42%"` &rarr; `0.42`.
  * Missing/empty width/height on the outermost SVG tag are defined in the
    SVG spec to mean 100% of the respective viewport dimension,
    so their `…Frac` will be `1` and their `…Px` will be `0`.




Usage
-----

see [the tests](test/).


<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
