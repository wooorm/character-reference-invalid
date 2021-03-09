import fs from 'fs'
import https from 'https'
import bail from 'bail'
import concat from 'concat-stream'
import unified from 'unified'
import parse from 'rehype-parse'
import {selectAll} from 'hast-util-select'
import toString from 'hast-util-to-string'

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

  fs.writeFile(
    'index.js',
    'export var characterReferenceInvalid = ' +
      JSON.stringify(data, null, 2) +
      '\n',
    bail
  )
}
