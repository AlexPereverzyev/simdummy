
# simdummy

Simple tool for HTTP response simulation, automated and load testing.

When started, server parses query string of incoming requests and responds with simulated latency, status code, JSON payload or any combination of the mentioned above.


## Installation

```
npm install simdummy
```

## Usage

To simulate echo headers response with approximately 200 ms latency, start the server:

```
const SimServer = require('simdummy')
const server = new SimServer().start()
```

Make HTTP call with simulation settings:

```
time curl http://localhost:9999/?l=200\&n=50\&eh=1
```

## Simulation Options

Available query string parameters:

- l - base latency
- n - latency noise
- s - response status
- bs - response body size in bytes, rounded to octet
- eh - request headers are stringified to response body
- d - destroy socket


## Startup Options

```
const SimServer = require('simdummy')

// set latency and response body size limits
const limits = { maxLatency: 500, maxBodySize: 16 * 1024 }

const server = new SimServer(limits)

server.start(s =>
    // execute code on start
    console.log(`Simulation server started at ${s.address().port}`),

    // set custom port
    9999
)

// request event is emited after settings parsed and limits applied
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
