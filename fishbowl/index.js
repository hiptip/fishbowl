var express = require('express');
var path = require('path');
var app = express();
var fish = require('./fishbowlgame'); 


// app.get('/', function(req, res) {
//     res.send("ASS");
// });


app.configure(function() {
    app.use(express.static(path.join(__dirname,'public')));
});

var server = require('http').createServer(app).listen(process.env.PORT || 8080);

var io = require('socket.io').listen(server);



// Listen for Socket.IO Connections. Once connected, start the game logic.
io.sockets.on('connection', function (socket) {
    //console.log('client connected');
    fish.initGame(io, socket);
});


