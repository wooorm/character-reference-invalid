import fs from 'node:fs'
import https from 'node:https'
import {bail} from 'bail'
import concat from 'concat-stream'
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import {selectAll} from 'hast-util-select'
import {toString} from 'hast-util-to-string'

const data = {
  0: '�'
}

https.get('https://html.spec.whatwg.org/multipage/parsing.html', onconnection)

function onconnection(response) {
  response.pipe(concat(onconcat)).on('error', bail)
}

function onconcat(buf) {
  const tree = unified().use(rehypeParse).parse(buf)
  const rows = selectAll('#table-charref-overrides tbody tr', tree)
  let index = -1
  let cells

  while (++index < rows.length) {
    cells = selectAll('td', rows[index])

    data[Number.parseInt(toString(cells[0]).slice(2), 16)] =
      String.fromCharCode(Number.parseInt(toString(cells[1]).slice(2), 16))
  }

  fs.writeFile(
    'index.js',
    'export const characterReferenceInvalid = ' +
      JSON.stringify(data, null, 2) +
      '\n',
    bail
  )
}
