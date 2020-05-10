
# simdummy

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

run((server, port) => {
    console.log(`Simulation server started at ${port}`)
}, 9999)
```

Then make HTTP call and specify required latency (eg: 200ms) in query string:

```
time curl http://localhost:9999/?l=200\&eh=1
```

To start HTTP listener to test asynchronous code with promises and async/await:

```
const test = require('simdummy').test

it('test async promise', async () => {
    await test(async (server, port) => {
        const res = await yourFavoriteHttpClient.get(`http://localhost:${port}`)
        assert.equal(res.status, 200)
    })
})
```

To start HTTP listener to test asynchronous code with callbacks, pass _done_ to _test_ call:

```
it('test async callback', done => {
    test((server, port, done) => {
        yourFavoriteHttpClient.get(`http://localhost:${port}`, res => {
            assert.equal(res.status, 200)
            done()
        })
    }, done)
})
```


## Simulation Options

Available query string parameters:

- l=200 - base latency
- n=50 - latency noise
- s=404 - response status
- bs=1024 - response body size in bytes, rounded to octet
- eh=1 - request headers are stringified to response body
- d=1 - destroy socket


## Startup Options

Simulation server can be started directly:

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
    console.log('Simulating response')

    // override response latency
    setting.latency.actual = 1000

    // override response body
    settings.response.body = 'Hello, world!'

    // or end response right here
    res.end()
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
