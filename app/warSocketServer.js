const net = require('net');

class WarSocketServer {
  constructor(port) {
    this._port = port;
    this.server = net.Server(this._acceptClient.bind(this))
  }

  _acceptClient(client) {
    console.log('client connected')
    client.write('you are connected')
    // associate player and client

    client.on('error', error => console.log(error))
    client.on('end', () => {
      console.log('client disconnected')
    })

    client.on('data', data => {
      // when client sends data
    })
  }

  portNumber() {
    return this._port;
  }

  start() {
    this.server.listen(this.portNumber(), '0.0.0.0');
  }

  stop() {
    this.server.close();
  }
}

module.exports = WarSocketServer;
