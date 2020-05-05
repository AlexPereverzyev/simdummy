"use strict"

module.exports.makeNoise = function(carrier, noise) {
    return carrier ? (carrier + noise * (2 * Math.random() - 1)) | 0 : 0
}

module.exports.makeJsonString = function(length) {
    const OctetString = 'octetstr'
    let d = ''
    const octets = (length & ~7) / 8
    for (let i = 0; i < octets; i++) {
        d += OctetString
    }
    return `{"d":"${d}"}`
}
