'use strict';

var fs = require('fs');
var jsdom = require('jsdom');
var bail = require('bail');

jsdom.env('https://html.spec.whatwg.org/multipage/parsing.html', function (err, window) {
  bail(err);

  var $table = window.document.getElementById('table-charref-overrides');
  var $rows = $table.querySelectorAll('tbody > tr');
  var data = {
    0: '�'
  };

  [].forEach.call($rows, function ($row) {
    var cells = $row.querySelectorAll('td');
    var numeric = cells[0].textContent;
    var char = cells[1].textContent;

    numeric = parseInt(numeric.slice(2), 16);
    char = String.fromCharCode(parseInt(char.slice(2), 16));

    data[numeric] = char;
  });

  fs.writeFileSync('index.json', JSON.stringify(data, 0, 2) + '\n');
});
