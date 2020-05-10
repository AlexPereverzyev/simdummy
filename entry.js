"use strict"

const run = require('./').run

run((s, p) => {
    console.log(`Simulation server started at ${p}`)
})
