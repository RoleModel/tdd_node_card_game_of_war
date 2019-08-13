const net = require('net');

class WarSocketServer {
  constructor(port) {
    this._port = port;
    this._games = [];
    this._pendingClients = [];
    this.server = net.Server(client => {
      this._pendingClients.push(client)
      console.log('client connected');
      if (this._pendingClients.length < 2) {
        client.write('Welcome. Waiting for another player to join.\r\n');
      } else {
        const clients = this._pendingClients.splice(0, 2)
        this._games.push(clients)
        client.write('Welcome. You are about to go to war.\r\n')

        clients.forEach(client => client.write('You have 26 cards left'))
      }

      client.on('error', error => console.log(error))
      client.on('end', () => {
        console.log('client disconnected')
      });

      client.on('data', data => {
        console.log(data.toString())
      });
      client.pipe(client)

    });
  }

  get games() {
    return this._games;
  }

  portNumber() {
    return this._port;
  }

  start() {
    this.server.listen(this.portNumber(), '127.0.0.1');
  }

  stop() {
    this.server.close();
  }
}

module.exports = WarSocketServer;
