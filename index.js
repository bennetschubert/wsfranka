process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const axios = require('axios')
const WebSocket = require('ws')
const headers = {Cookie: 'authorization=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJuYW1lIjoiU0JMIFBhbmRhMSIsInJvbGUiOnsiYXV0aG9yaXphdGlvbiI6W3sicGVybWlzc2lvbiI6IlJlYWRXcml0ZSIsInJlc291cmNlIjoiVGFza3MifSx7InBlcm1pc3Npb24iOiJSZWFkV3JpdGUiLCJyZXNvdXJjZSI6IlNraWxscyJ9LHsicGVybWlzc2lvbiI6IlJlYWRXcml0ZSIsInJlc291cmNlIjoiUGFyYW1ldGVycyJ9LHsicGVybWlzc2lvbiI6IlJlYWRXcml0ZSIsInJlc291cmNlIjoiRXhlY3V0aW9uIn0seyJwZXJtaXNzaW9uIjoiUmVhZFdyaXRlIiwicmVzb3VyY2UiOiJTdGF0dXMifSx7InBlcm1pc3Npb24iOiJSZWFkV3JpdGUiLCJyZXNvdXJjZSI6IkJ1bmRsZXMifSx7InBlcm1pc3Npb24iOiJSZWFkV3JpdGUiLCJyZXNvdXJjZSI6IlNjcmlwdHMifSx7InBlcm1pc3Npb24iOiJSZWFkV3JpdGUiLCJyZXNvdXJjZSI6IkFkbWluIn1dLCJuYW1lIjoiYWRtaW4ifX0.QjnvW8VcuhS7p-RqGo8vZLDGxFwsoyeGx0hM73Qc8JOAKUZ9R5ZmwB0qLVICNOKGlKQi8pEk2qwWQo_QqFdp9w'}

const URLS = {
	values: 'wss://192.168.0.1/desk/api/modbus/values', //WS
	timelines: 'wss://192.168.0.1/desk/api/timelines', //WS
	execution: 'https://192.168.0.1/desk/api/execution' //POST
}

const sTimelines = new WebSocket(URLS.timelines, null, {headers})
const sValues = new WebSocket(URLS.values, null, {headers})

function execTask(id){
	return axios.request(URLS.execution,{
		method: 'POST',
		headers: Object.assign({
			'Accept': '*/*',
			'Accept-Encoding': 'gzip, deflate, br',
			'Connection': 'keep-alive',
			'Content-Type': 'application/x-www-form-urlencoded',
		}, headers),
		'data': `id=${id}`
	})
}

var lastState = true;
sValues.on('message', (m)=>{
	var {input, output} = JSON.parse(m).module[0]
	var values = output[0].values[9]
	if(values != lastState && values === true) {
		console.log(Date.now(), values.toString())
		execTask('test_schnittstelle')
		.catch((e)=>{
			console.error(e)
		})
	}

	lastState = values
})

var timelines = null
sTimelines.on('message', (m)=>{
	var tl = JSON.parse(m)
	timelines = tl.map(t=>({id: t.id, name: t.name}))
	console.log(timelines)
})

//Tasknamen abrufen
//Abhängig von geändertem Bit soll ein Task ausgeführt werden
