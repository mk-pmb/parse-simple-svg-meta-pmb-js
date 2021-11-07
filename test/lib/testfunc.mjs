// -*- coding: utf-8, tab-width: 2 -*-

import 'usnam-pmb';
import 'p-fatal';
import equal from 'equal-pmb';

import findSvgMeta from '../../omst.mjs';


function test(svg, want) {
  let r;
  try {
    r = findSvgMeta([].concat(svg).join('\n'));
  } catch (err) {
    r = String(err);
  }
  equal(r, want);
}


Object.assign(test, {

  svgHeadDefault: [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"',
    '  "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
  ],

});


export default test;
