"use strict"

module.exports.current = {
    maxLatency: 60 * 1000,
    maxBodySize: 5 * 1025,
}


module.exports.set = function(custom) {
    if (!custom) {
        return
    }
    if (custom.maxLatency) {
        this.current.maxLatency = custom.maxLatency
    }
    if (custom.maxBodySize) {
        this.current.maxBodySize = custom.maxBodySize
    }
}

module.exports.apply = function(settings) {
    if (settings.latency.actual < 0) {
        settings.latency.actual = 0
    }
    if (settings.latency.actual > this.current.maxLatency) {
        settings.latency.actual = this.current.maxLatency
    }
    if (settings.response.bodySize > this.current.maxBodySize) {
        settings.response.bodySize = this.current.maxBodySize
    }
    return settings
}
