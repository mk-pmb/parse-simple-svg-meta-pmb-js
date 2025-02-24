// -*- coding: utf-8, tab-width: 2 -*-

import test from './lib/testfunc.mjs';

const dfHead = test.svgHeadDefault;
test(dfHead, 'Error: Expected "<svg " but found: (empty)');

test([...dfHead, '<svg>'], {
  widthPx: 0,
  widthFrac: 1,
  heightPx: 0,
  heightFrac: 1,
});

test([...dfHead, '<svg width="300">'], {
  width: '300',
  widthPx: 300,
  widthFrac: 0,
  heightPx: 0,
  heightFrac: 1,
});

test([...dfHead, "<svg xmlns='http://www.w3.org/2000/svg' version='1.1'>"], {
  xmlns: 'http://www.w3.org/2000/svg',
  version: '1.1',
  widthPx: 0,
  widthFrac: 1,
  heightPx: 0,
  heightFrac: 1,
});

test([...dfHead, '<svg width="23.5%" height="200px">'], {
  width: '23.5%',
  widthPx: 0,
  widthFrac: 0.235,
  height: '200px',
  heightPx: 200,
  heightFrac: 0,
});

test([
  ...dfHead,
  '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',
  '  x="0px" y="0px" width="210mm" height="297mm" viewBox="0 0 210 297"',
  '  xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve">',
], 'Error: width: Unsupported number format or length unit: 210mm');





console.info('+OK usage test passed.');
