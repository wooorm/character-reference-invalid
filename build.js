'use strict'

var fs = require('fs')
var https = require('https')
var bail = require('bail')
var concat = require('concat-stream')
var unified = require('unified')
var parse = require('rehype-parse')
var selectAll = require('hast-util-select').selectAll
var toString = require('hast-util-to-string')

var data = {
  0: '�'
}

https.get('https://html.spec.whatwg.org/multipage/parsing.html', onconnection)

function onconnection(response) {
  response.pipe(concat(onconcat)).on('error', bail)
}

function onconcat(buf) {
  var tree = unified().use(parse).parse(buf)
  var rows = selectAll('#table-charref-overrides tbody tr', tree)
  var index = -1
  var cells

  while (++index < rows.length) {
    cells = selectAll('td', rows[index])

    data[parseInt(toString(cells[0]).slice(2), 16)] = String.fromCharCode(
      parseInt(toString(cells[1]).slice(2), 16)
    )
  }

  fs.writeFile('index.json', JSON.stringify(data, null, 2) + '\n', bail)
}
