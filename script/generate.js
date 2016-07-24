/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module character-reference-invalid:script
 * @fileoverview Generate
 */

'use strict';

/* Dependencies. */
var fs = require('fs');
var jsdom = require('jsdom');
var bail = require('bail');

/* Constants. */
var URI = 'https://html.spec.whatwg.org/multipage/syntax.html';

/* Read. */
jsdom.env(URI, function (err, window) {
  bail(err);

  /* Transform. */
  var $table = window.document.getElementById('table-charref-overrides');
  var $rows = $table.querySelectorAll('tbody > tr');
  var data = {};

  [].forEach.call($rows, function ($row) {
    var cells = $row.querySelectorAll('td');
    var numeric = cells[0].textContent;
    var char = cells[1].textContent;

    numeric = parseInt(numeric.slice(2), 16);
    char = String.fromCharCode(parseInt(char.slice(2), 16));

    data[numeric] = char;
  });

  /* Write. */
  fs.writeFileSync('index.json', JSON.stringify(data, 0, 2) + '\n');
});
