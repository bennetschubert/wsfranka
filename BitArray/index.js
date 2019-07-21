class BitArray extends Array{
	static fromString(s){
		return Array.from(s).map((c)=>c == 0 ? false : true)
	}

	constructor(bits){
		if(typeof bits === 'string') super(...BitArray.fromString(bits))
		else if(bits instanceof Array) super(...bits)
		else super(new Array(bits))
	}

	set(n, value){
		if(n >= this.length){
			throw new Error('invalid bit position' + n)
		}
		this[n] = !!value
		return this
	}

	and(operand){
		const result = new Array(this.length)
		for(let i = 0; i < this.length; i++){
			result[i] = (this[i] && operand[i])
		}
		return new this.constructor(result)
	}

	or(operand){
		const result = new Array(this.length)
		for(let i = 0; i < this.length; i++){
			result[i] = (this[i] || operand[i])
		}
		return new this.constructor(result)
	}

	not(){
		const result = new Array(this.length)
		for(let i = 0; i < this.length; i++){
			result[i] = !this[i]
		}
		return new this.constructor(result)
	}

	xor(operand){
		const result = new Array(this.length)
		for(let i = 0; i < this.length; i++){
			result[i] = (this[i] != operand[i])
		}
		return new this.constructor(result)
	}

	clone(){
		return new this.constructor(this)
	}

	toString(){
		return this
		.map(bit=>bit ? '1' : '0')
		.join('')
	}

}

module.exports = BitArray
