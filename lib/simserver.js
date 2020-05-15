"use strict"

const EventEmitter = require('events');
const http = require('http')
const settings = require('./settings')
const utils = require('./utils')
const limits = require('./limits')

class SimServer extends EventEmitter {
    constructor(customLimits) {
        super()
        limits.init(this, customLimits)
        this.stats = {
            calls: 0,
            drops: 0,
            sents: 0,
        }
    }

    start(callback, port) {
        this.server = http.createServer((req, res) => this.acceptRequest(req, res))
        this.server.listen(settings.parseUInt(port) || settings.parseUIntArg(2, 0))
        if (callback) {
            this.server.once('listening', () => callback(this.server))
        }
        return this
    }

    close(callback) {
        if (this.server) {
            this.server.close(callback)
        }
        return this
    }

    acceptRequest(req, res) {
        this.stats.calls++
        res.once('finish', () => this.stats.sents++)
        const setting = limits.apply(this, settings.parse(req.url))

        this.emit('request', req, res, setting)

        if (res.finished) {
            return
        }
        if (req.socket.destroyed) {
            this.stats.drops++
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
            this.stats.drops++
            return
        }

        if (!setting.response.body) {
            if (setting.response.echoBody) {
                setting.response.body = null
            } else if (setting.response.echoHeaders) {
                setting.response.body = JSON.stringify(req.headers)
            } else if (setting.response.bodySize) {
                setting.response.body = utils.makeJsonString(setting.response.bodySize)
            }
            if (setting.response.body) {
                res.setHeader('Content-Type', 'application/json')
            }
        }
        if (setting.response.status) {
            res.statusCode = setting.response.status
        }

        this.emit('response', req, res, setting)

        if (res.finished) {
            return
        }
        if (req.socket.destroyed) {
            this.stats.drops++
            return
        }
        if (setting.response.body) {
            res.end(setting.response.body + '\n')
        } else if (setting.response.echoBody) {
            req.pipe(res)
        } else {
            res.end()
        }
    }
}

module.exports = SimServer
