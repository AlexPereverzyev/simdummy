"use strict"

const EventEmitter = require('events');
const http = require('http')
const settings = require('./settings')
const utils = require('./utils')
const limits = require('./limits')
const defaultPort = 9999

class SimServer extends EventEmitter {
    constructor(customLimits) {
        super()
        limits.init(this, customLimits)
    }

    start(callback, port) {
        this.server = http.createServer((req, res) => this.acceptRequest(req, res))
        this.server.listen(port || settings.parseArgInt(2, defaultPort))
        if (callback) {
            this.server.once('listening', () => callback(this.server))
        }
        return this
    }

    stop(callback) {
        if (this.server) {
            this.server.close(callback)
        }
        return this
    }

    acceptRequest(req, res) {
        const setting = limits.apply(this, settings.parse(req.url))
        this.emit('request', req, res, setting)
        if (res.finished) {
            return
        }
        if (setting.latency.actual) {
            setTimeout(() => this.sendResponse(req, res, setting), setting.latency.actual)
        } else {
            this.sendResponse(req, res, setting)
        }
    }

    sendResponse(req, res, setting) {
        if (setting.socket.destroy) {
            req.socket.destroy()
            return
        }
        if (setting.response.status) {
            res.statusCode = setting.response.status
        }
        let body = setting.response.body
        if (!body) {
            if (setting.response.echoHeaders) {
                body = JSON.stringify(req.headers)
            } else if (setting.response.bodySize) {
                body = utils.makeJsonString(setting.response.bodySize)
            }
            if (body) {
                res.setHeader('Content-Type', 'application/json')
            }
        }
        if (body) {
            res.end(body + '\n')
        } else {
            res.end()
        }
    }
}

module.exports = SimServer
