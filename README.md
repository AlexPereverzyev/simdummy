
# simdummy

[![npm](https://img.shields.io/npm/v/simdummy.svg?style=flat-square)](https://www.npmjs.org/package/simdummy)

Simple tool for HTTP response simulation, automated and load testing.

When started, server parses query string of incoming requests and responds with simulated latency, status code, JSON payload or any combination of the mentioned above.


## Installation

```
npm install simdummy
```


## Usage

To simulate HTTP response with latency, start listener at custom port:

```
const run = require('simdummy').run

run((port, stats, server) => {
    console.log(`Simulation server started at ${port}`)
}, 9999)
```

Then make HTTP call and specify required latency (eg: 200ms) in query string:

```
time curl http://localhost:9999/?l=200\&eh=1
```

### Testing with Promises

To start HTTP listener to test asynchronous code with promises and async/await:

```
const test = require('simdummy').test

it('test async promise', async () => {
    await test(async (port, stats, server) => {
        const res = await yourHttpClient.get(`http://localhost:${port}`)
        expect(res.status).to.equal(200)
        expect(stats.calls).to.equal(1)
    })
})
```

Sim server collects basic statistics about number of requests received, responses sent and calls droped. The _stats_ are exposed on sim sever instance as property and passed to _run_ and _test_ callbacks as argument:

- calls - number of requests accepted
- sents - number of responses sent
- drops - number of responses dropped

### Testing with Callbacks

To start HTTP listener to test asynchronous code with callbacks, pass _done_ to _test_ call:

```
it('test async callback', done => {
    test((port, stats, server, done) => {
        yourHttpClient.get(`http://localhost:${port}`, res => {
            expect(res.status).to.equal(200)
            expect(stats.calls).to.equal(1)
            done()
        })
    }, done)
})
```

### Simulation Settings

Simulation settings are passed as query string parameters:

- l=200 - base latency
- n=50 - latency noise
- s=404 - response status
- eb=1 - request body is piped to response body
- eh=1 - request headers are stringified to response body
- bs=1024 - response body size in bytes, rounded to octet
- d=1 - destroy request socket
- lr=1 - log request to console


## Startup Options and Events

Here is an example of how the simulation server can be started and which events are exposed.

```
const SimServer = require('simdummy').SimServer

// set latency and response body size limits
const limits = { maxLatency: 500, maxBodySize: 16 * 1024 }

const server = new SimServer(limits)

server.start(s =>
    // execute code on start
    console.log(`Simulation server started at ${s.address().port}`),

    // set custom port
    9999
)

// request event is emitted after settings parsed and limits applied
server.on('request', (req, res, settings) => {
    console.log('Accepted request')

    // override response latency
    setting.latency.actual = 1000

    // override response body
    settings.response.body = 'Hello, world!'

    // or end response right here
    res.end()
})

// response event is emitted before sending response
server.on('response', (req, res, settings) => {
    console.log('Sending response')

    // pipe request to response
    settings.response.echoBody = true

    // or override the whole body
    settings.response.body = 'Hello, world!'

    // set different status code
    res.statusCode = 201
})

// stop the server
server.close(err => {
    // execute code on stop
    console.log('Simulation server stopped')
})
```

## Docker

To start simdummy in [Docker container](https://hub.docker.com/r/alexpereverzyev/simdummy):

```
docker run --name sd -p 9999:9999 -d alexpereverzyev/simdummy
```
