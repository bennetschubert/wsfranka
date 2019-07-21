const assert = require('assert')

const BitArray = require('./index.js')

var a = new BitArray([false, false, true, true])
var b = new BitArray([false, true, false, true])
var c = new BitArray('11001100')

const expectedAnd = new BitArray([false, false, false, true])
const expectedOr = new BitArray([false, true, true, true])
const expectedNotA = new BitArray([true, true, false, false])
const expectedXor = new BitArray([false, true, true, false])
const expectedStringA = '0011'
const expectedC = new BitArray([true, true, false, false, true, true, false, false])
const expectedCHamming = 4
const expectedCChanged = new BitArray('11000011')

assert.deepEqual(a.and(b), expectedAnd)
assert.deepEqual(a.or(b), expectedOr)
assert.deepEqual(a.not(b), expectedNotA)
assert.deepEqual(a.xor(b), expectedXor)
assert.deepEqual(a.toString(), expectedStringA)
assert.deepEqual(c.hamming(), expectedCHamming)
assert.deepEqual(c, expectedC)

var cChanged = c.clone()
.set(4, false)
.set(5, false)
.set(6, true)
.set(7, true)

assert.deepEqual(cChanged, expectedCChanged)

//make sure we did not change the original bitarrays
assert.deepEqual(a, new BitArray('0011'))
assert.deepEqual(b, new BitArray('0101'))
assert.deepEqual(c, new BitArray('11001100'))

console.log('success')
