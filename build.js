import fs from 'node:fs'
import https from 'node:https'
import {bail} from 'bail'
import concat from 'concat-stream'
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import {selectAll} from 'hast-util-select'
import {toString} from 'hast-util-to-string'

/** @type {Record.<number, string>} */
const data = {
  0: '�'
}

https.get('https://html.spec.whatwg.org/multipage/parsing.html', (response) => {
  response.pipe(concat(onconcat)).on('error', bail)
})

/**
 * @param {Buffer} buf
 */
function onconcat(buf) {
  const tree = unified().use(rehypeParse).parse(buf)
  const rows = selectAll('#table-charref-overrides tbody tr', tree)
  let index = -1

  while (++index < rows.length) {
    const cells = selectAll('td', rows[index])

    data[Number.parseInt(toString(cells[0]).slice(2), 16)] =
      String.fromCharCode(Number.parseInt(toString(cells[1]).slice(2), 16))
  }

  fs.writeFile(
    'index.js',
    [
      '/**',
      ' * Map of invalid numeric character references to their replacements, according to HTML.',
      ' *',
      ' * @type {Record<number, string>} ',
      ' */',
      'export const characterReferenceInvalid = ' +
        JSON.stringify(data, null, 2),
      ''
    ].join('\n'),
    bail
  )
}
