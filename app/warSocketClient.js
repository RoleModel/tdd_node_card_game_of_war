var net = require('net')

var socket = new net.Socket();

socket.connect(1337, '127.0.0.1', () => {
  console.log('Connected');
});

socket.on('close', () => {
  console.log('Connection closed')
});

// fill in behavior
