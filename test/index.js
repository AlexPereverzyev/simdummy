"use strict"

const SimServer = require('../lib/simserver')

const server = new SimServer({ maxLatency: 500 })

server.start(s => {
    console.log(`Simulation server started at ${s.address().port}`)
})

server.on('request', (req, res, settings) => {
    console.log(JSON.stringify(settings))
})

module.exports = SimServer
