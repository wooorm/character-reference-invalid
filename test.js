/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module character-reference-invalid
 * @fileoverview Test suite for `character-reference-invalid`.
 */

'use strict';

/* Dependencies. */
var test = require('tape');
var characterReferenceInvalid = require('./');

/* Tests. */
test('characterEntities', function (t) {
  t.equal(characterReferenceInvalid[0x80], '€');
  t.equal(characterReferenceInvalid[0x89], '‰');
  t.equal(characterReferenceInvalid[0x99], '™');

  t.end();
});
