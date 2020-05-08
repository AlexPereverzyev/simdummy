"use strict"

const SimServer = require('./lib/simserver')

const server = new SimServer()

server.start(s => {
    console.log(`Simulation server started at ${s.address().port}`)
})

module.exports = SimServer
