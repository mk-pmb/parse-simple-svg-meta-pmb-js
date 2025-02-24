// -*- coding: utf-8, tab-width: 2 -*-

const rx = {
  preWsp: /^\s+/,
  xmlInitTag: /^<\?[ !-;=\?-~]*\?>/,
  docTypeTag: /^<\!DOCTYPE [ -;=-~]*>/,
  svgTagStart: /^<svg(?= |>)/i,
  simpleAttr: /^([a-z:]+)=('|")([ !#-&\(-;=\?-~]*)('|")/i,
  lengthUnit: /^([0-9\.]+)(%|px|)$/,
};
const emptyDummyIterable = '';


const EX = function findSvgMeta(svg) {
  let buf = svg.replace(/\s+/g, ' ');
  // console.debug('buf:', buf);

  function bad(want) {
    const found = (buf.slice(0, 32) || '(empty)');
    throw new Error('Expected ' + want + ' but found: ' + found);
  }

  function eat(k) {
    const m = (rx[k].exec(buf) || false);
    // console.debug('buf:', buf);
    // console.debug('eat:', rx[k], k, m);
    if (m) { buf = buf.slice(m[0].length); }
    return m;
  }

  // eslint-disable-next-line no-empty
  while (eat('preWsp') || eat('xmlInitTag') || eat('docTypeTag')) {}

  if (!eat('svgTagStart')) { bad('"<svg "'); }
  let attrs = {};
  while (true) { // eslint-disable-line no-constant-condition
    eat('preWsp');
    if (buf.startsWith('>')) { break; }
    const [m, k, q1, v, q2] = eat('simpleAttr') || emptyDummyIterable;
    if (!m) { bad('">" or a simple attribute'); }
    if (q1 !== q2) { bad('confusing quotes in attribute value'); }
    attrs[k] = v;
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
    const m = rx.lengthUnit.exec(orig);
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
