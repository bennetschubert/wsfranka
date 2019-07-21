const {EventEmitter} = require('events')
const BitArray = require('../BitArray')

function isBitArray(arg){
	return arg instanceof BitArray
}

class BitWatch extends EventEmitter{
	constructor(){
		super()
		this.state = null
		this.mode = this.constructor.Default.MODE
	}

	getState(){
		if(!this.state) return null
		return this.state.clone()
	}

	setMode(mode){
		if(!Object.values(this.constructor.Mode).find(v=>v===mode)) throw new Error('Unknown Mode' + mode)
		this.mode = mode
	}

	reset(){
		this._state = null
	}

	isInitialized(){
		return !!this.state
	}

	initialize(state){
		if(!isBitArray(state)) throw new Error(this.constructor.Error.INVALID_ARGUMENT)
		this.state = state
		this.mask = new BitArray(this.state.length).not()
		this.emit('init', {state: this.state.clone()})
	}

	update(state){
		if(!isBitArray(state)) throw new Error(this.constructor.Error.INVALID_ARGUMENT)
		if(!this.isInitialized()) this.initialize(state)
		var previous = this.state.clone()
		this.state = state

		var changed = previous.xor(state)
		var distance = changed.hamming()
		if(distance < 1) return

		if(this.mode === this.constructor.Mode.GLOBAL){
			this.emit('change', {previous, state, changed, distance})
		}
		else if(this.mode === this.constructor.Mode.BITWISE){
			changed.forEach((bit, i)=>{
				if(!bit) return
				this.emit('bitchange', {
					bit: i,
					edge: state[i] ? this.constructor.Edge.RISING : this.constructor.Edge.FALLING,
					value: state[i]
				})
			})
		}

	}
}

BitWatch.Error = {
	INVALID_ARUMENT: 'invalid argument, must be instance of BitArray'
}

BitWatch.Edge = {
	RISING: 'rising',
	FALLING: 'falling'
}

BitWatch.Mode = {
	GLOBAL: 'GLOBAL',
	BITWISE: 'BITWISE'
}

BitWatch.Default = {
	MODE: 'BITWISE'
}

module.exports = BitWatch
