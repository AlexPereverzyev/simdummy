"use strict";

const process = require('process')
const http = require('http')
const settings = require('./lib/settings')
const utils = require('./lib/utils')
const limits = require('./lib/limits')
const port = settings.parseArgInt(2, 9999)
const backlog = 10000

process.on('warning', e => console.warn(e.stack))
process.on('SIGINT', () => process.exit())

const server = http.createServer((req, res) => {
    const setting = limits.apply(settings.parse(req.url))
    if (setting.latency.actual) {
        setTimeout(() => sendResponse(req, res, setting), setting.latency.actual)
    } else {
        sendResponse(req, res, setting)
    }
})

function sendResponse(req, res, setting) {
    if (setting.socket.destroy) {
        req.socket.destroy()
    } else {
        if (setting.response.status) {
            res.statusCode = setting.response.status
        }
        if (setting.response.echoHeaders) {
            const body = JSON.stringify(req.headers)
            res.setHeader('content-type', 'application/json')
            res.end(body + '\n')
        } else if (setting.response.bodySize) {
            const body = utils.makeJsonString(setting.response.bodySize)
            res.setHeader('content-type', 'application/json')
            res.end(body + '\n')
        } else {
            res.end()
        }
    }
}

server.listen(port, backlog);
console.log(`SimDummy HTTP server listening at ${port}`)

module.exports = server
