/* globals io */

var socket = io('localhost:3000');

socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});
