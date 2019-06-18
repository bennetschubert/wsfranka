const ws = require('ws')
const axios = require('axios')
const auth = require('./auth')

const REQUEST_TIMEOUT = 2000 //in ms

function Franka(ip){
	const PATHS = {
		authenticate: '/admin/api/login', //POST TODO: Replace this. with the right path
		execution: '/desk/api/execution', //POST
		values: '/desk/api/modbus/values', //WS
		timelines: '/desk/api/timelines', //WS
	}

	var host = ip
	var client = null
	var token = null

	function getWsUrl(path){
		return `wss://${host}${path}`
	}

	function setToken(newtoken){
		token = newtoken
		client.defaults.headers.common['Cookie'] = `authorization=${token}`
	}

	async function authenticate(username, password){
		let data = auth.generateAuthBody(username, password)
		return client.request({
			method: 'post',
			url: PATHS.authenticate,
			data: data,
			credentials: true
		})
		.then(response=>{
			setToken(response.data)
			return true
		})
		.catch(e=>{
			setToken(null)
			throw new Error('Authentication failed')
		})
	}

	async function connect(username, password){
		client = axios.create({
			baseURL: `https://${host}`,
			timeout: REQUEST_TIMEOUT
		})
		if(!token) await authenticate(username, password)
	}

	function subscribe(topic){
		var path = PATHS[topic]
		if(!path) throw new Error(`topic not found ${topic}`)
		var url = getWsUrl(path)
		console.log(client.defaults.headers.common)
		return new ws(url, null, {headers: client.defaults.headers.common})
	}

	return {
		setToken: setToken.bind(this),
		connect: connect.bind(this),
		subscribe: subscribe.bind(this)
	}

}

module.exports = Franka
