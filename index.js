"use strict"

const SimServer = require('./lib/simserver')

module.exports.SimServer = SimServer

module.exports.run = function (callbackOrPort, maybePort) {
    const sim = new SimServer()
    if (typeof callbackOrPort === 'function') {
        return sim.start(s => callbackOrPort(s.address().port, sim.stats, s), maybePort)
    }
    return sim.start(null, callbackOrPort)
}

module.exports.test = function (routine, done, timeout = 10 * 1000) {
    if (!routine) {
        throw new Error('Test routine is required')
    }
    const sim = new SimServer()
    const safety = setTimeout(() => sim.close(), timeout)

    if (typeof done !== 'function') {
        return new Promise((resolve, reject) => {
            sim.start(async s => {
                try {
                    resolve(await routine(s.address().port, sim.stats, s))
                } catch (e) {
                    reject(e)
                } finally {
                    sim.close()
                    clearTimeout(safety)
                }
            })
        })
    } else {
        sim.start(async s => {
            const closeAndDone = e => {
                sim.close(() => done(e))
                clearTimeout(safety)
            }
            try {
                routine(s.address().port, sim.stats, s, closeAndDone)
            } catch (e) {
                closeAndDone(e)
            }
        })
    }
}
