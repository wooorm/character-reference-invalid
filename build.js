'use strict';

var fs = require('fs');
var https = require('https');
var bail = require('bail');
var concat = require('concat-stream');
var unified = require('unified');
var parse = require('rehype-parse');
var selectAll = require('hast-util-select').selectAll;
var toString = require('hast-util-to-string');

var data = {
  0: '�'
};

https.get('https://html.spec.whatwg.org/multipage/parsing.html', function (res) {
  res.pipe(concat(onconcat)).on('error', bail);

  function onconcat(buf) {
    var tree = unified().use(parse).parse(buf);

    selectAll('#table-charref-overrides tbody tr', tree).forEach(each);

    function each(row) {
      var cells = selectAll('td', row);
      var numeric = parseInt(toString(cells[0]).slice(2), 16);
      var char = String.fromCharCode(parseInt(toString(cells[1]).slice(2), 16));

      data[numeric] = char;
    }

    fs.writeFile('index.json', JSON.stringify(data, 0, 2) + '\n', bail);
  }
});
