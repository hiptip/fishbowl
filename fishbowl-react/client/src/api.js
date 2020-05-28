import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:9000');
console.log(socket)
function subscribeToTimer(cb) {
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
}
export { subscribeToTimer };