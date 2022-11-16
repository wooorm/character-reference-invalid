import fs from 'node:fs/promises'
import fetch from 'node-fetch'
import {fromHtml} from 'hast-util-from-html'
import {selectAll} from 'hast-util-select'
import {toString} from 'hast-util-to-string'

/** @type {Record<number, string>} */
const data = {
  0: '�'
}

const response = await fetch(
  'https://html.spec.whatwg.org/multipage/parsing.html'
)
const text = await response.text()

const tree = fromHtml(text)

const rows = selectAll('#table-charref-overrides tbody tr', tree)
let index = -1

while (++index < rows.length) {
  const cells = selectAll('td', rows[index])

  const key = Number.parseInt(toString(cells[0]).slice(2), 16)
  const value = Number.parseInt(toString(cells[1]).slice(2), 16)

  data[key] = String.fromCodePoint(value)
}

await fs.writeFile(
  'index.js',
  [
    '/**',
    ' * Map of invalid numeric character references to their replacements, according to HTML.',
    ' *',
    ' * @type {Record<number, string>} ',
    ' */',
    'export const characterReferenceInvalid = ' + JSON.stringify(data, null, 2),
    ''
  ].join('\n')
)
