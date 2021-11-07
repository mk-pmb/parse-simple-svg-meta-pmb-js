// -*- coding: utf-8, tab-width: 2 -*-

const svgTagStartRx = /^<svg(?= |>)/;
const boringPreStuff = /^(?:\s+|<(?:\?[ -;=\?-~]*\?|\!DOCTYPE [ -;=-~]*)>)*/i;
const attrRx = /^ ?(>)|^ ([a-z:]+)="([ !#-;=\?-~]*)"/i;
const lengthUnitRx = /^([0-9\.]+)(%|px|)$/;


const EX = function findSvgMeta(svg) {
  let buf = svg.replace(/\s+/g, ' ');

  function bad(want) {
    const found = (buf.slice(0, 32) || '(empty)');
    throw new Error('Expected ' + want + ' but found: ' + found);
  }

  function eat(rx) {
    const m = (rx.exec(buf) || false);
    if (m) { buf = buf.slice(m[0].length); }
    return m;
  }

  eat(boringPreStuff);
  if (!eat(svgTagStartRx)) { bad('"<svg "'); }
  let attrs = {};
  while (true) { // eslint-disable-line no-constant-condition
    const m = eat(attrRx);
    if (!m) { bad('">" or an attribute'); }
    if (m[1]) { break; }
    attrs[m[2]] = m[3];
  }

  attrs = {
    ...attrs,
    ...EX.decodeLength(attrs, 1, 'width'),
    ...EX.decodeLength(attrs, 1, 'height'),
  };

  return attrs;
};


Object.assign(EX, {

  pxFrac(key, px, frac) { return { [key + 'Px']: px, [key + 'Frac']: frac }; },

  decodeLength(attrs, dfFrac, key) {
    const orig = attrs[key];
    if (!orig) { return EX.pxFrac(key, 0, dfFrac); }
    const m = lengthUnitRx.exec(orig);
    if (!m) {
      const msg = (key + ': Unsupported number format or length unit: ' + orig);
      throw new Error(msg);
    }
    const unit = m[2];
    const len = +m[1];
    if (unit === '%') { return EX.pxFrac(key, 0, len / 100); }
    return EX.pxFrac(key, len, 0);
  },

});





export default EX;
