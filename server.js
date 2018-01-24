var express = require('express')
var app = express()
var ExpressPeerServer = require('peer').ExpressPeerServer

app.use(express.static('dist'))

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/dist/index.html')
})

var options = {
    debug: true,
    allow_discovery: true
}

var server = app.listen(9000)

peerServer = ExpressPeerServer(server, options)
app.use('/api', peerServer)

peerServer.on('connection', function(id) {
    console.log(id + ' connected')
})

server.on('disconnect', function(id) {
    console.log(id + ' disconnected')
})
