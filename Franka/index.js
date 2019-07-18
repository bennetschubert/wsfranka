const ws = require('ws')
const axios = require('axios')
const auth = require('./auth')

const REQUEST_TIMEOUT = 2000 //in ms

function Franka(){
	const PATHS = {
		authenticate: '/desk/login', //POST TODO: Replace this. with the right path
		execution: '/desk/api/execution', //POST
		values: '/desk/api/modbus/values', //WS
		timelines: '/desk/api/timelines', //WS
	}

	var client = null
	var token = null

	function setToken(newtoken){
		token = newtoken
		client.defaults.headers.common['Authorization'] = `Bearer ${token}`
	}

	async function authenticate(username, password){
		let data = auth.getAuthBody()
		return client.request({
			method: 'post',
			url: PATHS.authenticate,
			data: data
		})
		.then(response=>{
			setToken(response.data.token)
			return true
		})
		.catch(e=>{
			setToken(null)
			throw new Error('Authentication failed')
		})
	}

	async function connect(host, username, password){
		client = axios.create({
			baseURL: `https://${host}`,
			timeout: REQUEST_TIMEOUT
		})
		if(!token) await authenticate(username, password)
	}

	return {
		setToken: setToken.bind(this),
		connect: connect.bind(this)
	}
}

module.exports = Franka
