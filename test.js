import test from 'tape'
import {characterReferenceInvalid} from './index.js'

test('characterEntities', function (t) {
  t.equal(characterReferenceInvalid[0x80], '€')
  t.equal(characterReferenceInvalid[0x89], '‰')
  t.equal(characterReferenceInvalid[0x99], '™')

  t.end()
})
