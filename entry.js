"use strict"

const run = require('./').run

run(port => {
    console.info(`Simulation server started at ${port}`)
})
