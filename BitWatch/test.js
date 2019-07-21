const BitArray = require('../BitArray')
const BitWatch = require('./index.js')

const watch = new BitWatch()

watch.on('init', (e)=>{
	console.log('init', e)
})
watch.on('change', (e)=>{
	console.log('change', e)
})
watch.on('bitchange', (e)=>{
	console.log('bitchange', e)
})

watch.update(new BitArray('1001'))
watch.update(new BitArray('0000'))
watch.update(new BitArray('0001'))
watch.update(new BitArray('0001'))

watch.setMode(BitWatch.Mode.GLOBAL)
watch.update(new BitArray('0011'))
watch.update(new BitArray('0010'))

watch.setMode(BitWatch.Mode.BITWISE)
watch.update(new BitArray('0011'))
watch.update(new BitArray('0010'))
