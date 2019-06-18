process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const config = require('./config.json')
const Franka = require('./Franka')

const host = config.host
const credentials = config.credentials

var franka = new Franka(host)
franka.connect(credentials.user, credentials.password)
.then(()=>{
	franka.subscribe('values').on('message', onValuesReceived)
	franka.executeRobotAction(Franka.Actions['open-brakes'])
	franka.executeTimeline('test_schnittstelle')
	franka.executeRobotAction(Franka.Actions['close-brakes'])
})
.catch(e=>{
	console.error(e)
})

function onValuesReceived(values){
	console.log(values)
}
