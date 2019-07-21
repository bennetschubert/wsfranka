process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const Franka = require('./Franka')
const BitArray = require('./BitArray')
const BitWatch = require('./BitWatch')

const config = require('./config.json')
const host = config.host
const credentials = config.credentials

const franka = new Franka(host)
const EventMappings = createMappings(config.mappings)

function createEventId(bit, edge){
	return `bit.edge`
}

function createMappings(configmappings){
	return configmappings.reduce((accu, mapping)=>{
		var {bit, edge} = mapping
		var eventid = createEventId(bit, edge)
		if(!accu[eventid]) accu[eventid] = []
		accu[eventid].push(mapping)
		return accu
	}, {})
}

function executeMapping(mapping){
	var {action, taskid} = mapping
	switch(action){
		case 'timeline':
			franka.executeTimeline(taskid)
			.catch((e)=>console.error(e))
		break;
		case 'robot':
			franka.executeRobotAction(taskid)
			.catch((e)=>console.error(e))
		break;
		default: console.error('ignoring unrecognized action type' + action)
	}
}


function onValuesReceived(data){
	var {input, output} = JSON.parse(data).module[0]
	var bits = new BitArray(output[0].values)
	iowatch.update(bits)
}

const iowatch = new BitWatch()
iowatch.on('bitchange', (e)=>{
	var eventid = getEventId(e.bit, e.edge)
	var mappings = EventMappings[eventid]
	if(!mappings) return
	mappings.forEach(executeMapping)
})

franka.connect(credentials.user, credentials.password)
.then(async ()=>{
	await franka.unlock()
	franka.subscribe('values').on('message', onValuesReceived)
})
.catch(e=>{
	console.error(e)
	process.exit(-1)
})
