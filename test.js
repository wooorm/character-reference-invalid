'use strict';

var test = require('tape');
var characterReferenceInvalid = require('./');

test('characterEntities', function (t) {
  t.equal(characterReferenceInvalid[0x80], '€');
  t.equal(characterReferenceInvalid[0x89], '‰');
  t.equal(characterReferenceInvalid[0x99], '™');

  t.end();
});
