"use strict"

const url = require('url')
const u = require('./utils')

module.exports.parseUInt = function(value) {
    const v = parseInt(value)
    return !isNaN(v) && v >= 0 ? v : null
}

module.exports.parseUIntArg = function(position, defaultValue) {
    return process.argv && process.argv.length > position
        ? this.parseUInt(process.argv[position]) || defaultValue
        : defaultValue
}

module.exports.parse = function(rawUrl) {
    const parsedUrl = url.parse(rawUrl, true)
    const q = parsedUrl.query
    const c = {
        latency: {
            carrier: this.parseUInt(q.l),
            noise: this.parseUInt(q.n),
            actual: 0,
        },
        response: {
            status: this.parseUInt(q.s),
            bodySize: this.parseUInt(q.bs),
            echoBody: this.parseUInt(q.eb) === 1,
            echoHeaders: this.parseUInt(q.eh) === 1,
            body: undefined,
        },
        socket: {
            destroy: this.parseUInt(q.d) === 1,
        },
        logging: {
            request: this.parseUInt(q.lr) === 1,
        },
    }
    c.latency.actual = u.makeNoise(c.latency.carrier, c.latency.noise)
    return c
}
