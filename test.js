import assert from 'node:assert/strict'
import test from 'node:test'
import {characterReferenceInvalid} from './index.js'

test('characterEntities', function () {
  assert.equal(characterReferenceInvalid[0x80], '€')
  assert.equal(characterReferenceInvalid[0x89], '‰')
  assert.equal(characterReferenceInvalid[0x99], '™')
})
