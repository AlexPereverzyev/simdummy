"use strict"

const url = require('url')
const u = require('./utils')

module.exports.parseInt = function(value) {
    const v = +value
    return v && v >= 0 ? v : null
}

module.exports.parseArgInt = function(position, defaultValue) {
    return process.argv && process.argv.length > position
        ? this.parseInt(process.argv[position]) || defaultValue
        : defaultValue
}

module.exports.parse = function(rawUrl) {
    const parsedUrl = url.parse(rawUrl, true)
    const q = parsedUrl.query
    const c = {
        latency: {
            carrier: this.parseInt(q.l),
            noise: this.parseInt(q.n),
            actual: 0,
        },
        response: {
            status: this.parseInt(q.s),
            bodySize: this.parseInt(q.bs),
            echoHeaders: this.parseInt(q.eh) === 1,
            body: undefined,
        },
        socket: {
            destroy: this.parseInt(q.d) === 1,
        }
    }
    c.latency.actual = u.makeNoise(c.latency.carrier, c.latency.noise)
    return c
}
