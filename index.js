"use strict"

const SimServer = require('./lib/simserver')

module.exports.SimServer = SimServer

module.exports.run = function(callbackOrPort, maybePort) {
    if (typeof callbackOrPort === 'function') {
        return new SimServer().start(s => {
            callbackOrPort(s, s.address().port)
        }, maybePort)
    }
    return new SimServer().start(null, callbackOrPort)
}

module.exports.test = function(routine, done, timeout=10*1000) {
    if (!routine) {
        throw new Error('Test routine is required')
    }
    const server = new SimServer()
    const safety = setTimeout(() => server.close(), timeout)

    if (typeof done !== 'function') {
        return new Promise((resolve, reject) => {
            server.start(async s => {
                try {
                    resolve(await routine(s, s.address().port))
                } catch (e) {
                    reject(e)
                } finally {
                    server.close()
                    clearTimeout(safety)
                }
            })
        })
    } else {
        const closeAndDone = e => {
            server.close(_ => done(e))
            clearTimeout(safety)
        }
        server.start(async s => {
            try {
                routine(s, s.address().port, closeAndDone)
            } catch (e) {
                closeAndDone(e)
            }
        })
    }
}
