process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const config = require('./config.json')
const Franka = require('./Franka')

const host = config.host
const credentials = config.credentials

var franka = new Franka(host)
franka.connect(credentials.user, credentials.password)
.then(()=>{
	franka.subscribe('values')
	.on('message', (data)=>{
		console.log(data)
	})
})
.catch(e=>{
	console.error(e)
})
