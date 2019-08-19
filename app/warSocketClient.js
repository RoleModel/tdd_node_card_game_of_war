var net = require('net')

var socket = new net.Socket();

socket.connect(1337, '0.0.0.0', () => {
  console.log('Connected');
});

socket.on('data', data => {
  console.log(data.toString());
});

socket.on('close', () => {
  console.log('Connection closed')
});

process.stdin.on('data', input => {
  if (input === 'exit\n') {
    console.log('Program exiting.');
    process.exit();
  } else {
    socket.write(input);
  }
});
