#!/usr/local/bin/node
const auth = require('./auth')

var user = process.argv[2] || ''
var password = process.argv[3] || ''

var body = auth.generateAuthBody(user, password)

process.stdout.write(JSON.stringify(body, null, 2))
