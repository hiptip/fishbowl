#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from './app';
var debug = require('debug')('api:server');
import http from 'http';
import fish from './fishbowl';

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '9000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

//instantiate socket 
var io = require('socket.io').listen(server);

var count = 0;

io.sockets.on('connection', function (socket) {
  console.log('client connected ' + socket.id + " with count: " + count);
  count++;
  fish.initGame(io, socket);
});

// var countdown = 1000;
// setInterval(function() {
//   countdown--;
//   io.sockets.emit('timer', { countdown: countdown });
// }, 1000);

// io.sockets.on('connection', function (socket) {
//   socket.on('reset', function (data) {
//     countdown = 1000;
//     io.sockets.emit('timer', { countdown: countdown });
//   });
// });


// io.on("connection", (client) => {
//   client.on('subscribeToTimer', (interval) => {
//     console.log('client is subscribing to timer with interval ', interval);
//     setInterval(() => {
//       client.emit('timer', new Date());
//     }, interval);
//   });
// });

console.log('listening on port ', port);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
