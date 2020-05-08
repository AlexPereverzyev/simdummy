"use strict"

module.exports.init = function(instance, limits) {
    instance.maxLatency = 60 * 1000
    instance.maxBodySize = 16 * 1024
    if (!limits) {
        return
    }
    if (limits.maxLatency) {
        instance.maxLatency = limits.maxLatency
    }
    if (limits.maxBodySize) {
        instance.maxBodySize = limits.maxBodySize
    }
}

module.exports.apply = function(instance, settings) {
    if (settings.latency.actual < 0) {
        settings.latency.actual = 0
    }
    if (settings.latency.actual > instance.maxLatency) {
        settings.latency.actual = instance.maxLatency
    }
    if (settings.response.bodySize > instance.maxBodySize) {
        settings.response.bodySize = instance.maxBodySize
    }
    if (settings.response.status < 100) {
        settings.response.status = 200
    }
    if (settings.response.status > 599) {
        settings.response.status = 200
    }
    return settings
}
