"use strict"

const SimServer = require('./lib/simserver')

// todo: move to a separate script
const server = new SimServer()

server.start(s => {
    console.log(`SimDummy started at ${s.address().port}`)
})

server.on('settings', (req, res, setting) => {
    console.log('request!')
})

module.exports = SimServer
