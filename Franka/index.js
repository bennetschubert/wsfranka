const ws = require('ws')
const axios = require('axios')
const auth = require('./auth')

const CONNECT_TIMEOUT = 2000 //in ms
const REQUEST_TIMEOUT = 10000 //in ms

function Franka(ip){
	const PATHS = {
		authenticate: '/admin/api/login', //POST TODO: Replace this. with the right path
		execution: '/desk/api/execution', //POST
		values: '/desk/api/modbus/values', //WS
		timelines: '/desk/api/timelines', //WS
		robot: '/desk/api/robot', //WS
	}

	const Actions = Franka.Actions

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
			credentials: true,
			timeout: CONNECT_TIMEOUT
		})
		.then(response=>{
			setToken(response.data)
			return true
		})
		.catch(e=>{
			if(e.code == 'ECONNREFUSED') throw new Error("the robot did refuse the connection, recheck host setting")
			if(e.code == 'ECONNABORTED') throw new Error("the connection took to long, check network/host settings ")
			setToken(null)
			throw new Error('connection failed: ' +  e.code + ' ' + e.message)
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
		return new ws(url, null, {headers: client.defaults.headers.common})
	}

	function executeTimeline(timeline){
		return client.request(PATHS.execution,{
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: `id=${timeline}`
		})
		.then(response=>{
			return true
		})
		.catch(e=>{
			console.error(e)
			throw new Error(`failed to execute timeline ${timeline}`)
		})
	}

	function executeRobotAction(action){
		var actionString = Actions[action]
		if(!actionString) return Promise.reject(new Error(`unknow action ${action}`))
		var actionPath = `${PATHS.robot}/${actionString}`
		return client.post(actionPath)
		.then(response=>{
			return true
		})
		.catch(e=>{
			console.error(e)
			throw new Error(`failed to execute robot action ${action}`)
		})
	}

	function lock(){
		return executeRobotAction(Franka.Actions['close-brakes'])
	}

	function unlock(){
		return executeRobotAction(Franka.Actions['open-brakes'])
	}

	function listTimelines(){
		function formatTimeline(timeline){
			return {
				id: timeline.id,
				name: timeline.name
			}
		}

		return new Promise((resolve, reject)=>{
			subscribe('timelines')
			.on('message', (timelines)=>
				resolve(timelines.map(formatTimeline))
			)
		})
	}

	return {
		setToken: setToken.bind(this),
		connect: connect.bind(this),
		subscribe: subscribe.bind(this),
		executeTimeline: executeTimeline.bind(this),
		executeRobotAction: executeRobotAction.bind(this),
		listTimelines: listTimelines.bind(this),
		lock: lock.bind(this),
		unlock: unlock.bind(this)
	}
}

Franka.Actions = {
	"open-brakes": 'open-brakes',
	"close-brakes": 'close-brakes'
}

module.exports = Franka
