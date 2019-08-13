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
        const warGame = {
          clients,
          pendingTurns: {}
        }
        this._games.push(warGame)
        client.write('Welcome. You are about to go to war.\r\n')

        clients.forEach(client => client.write('You have 26 cards left'))
      }

      client.on('error', error => console.log(error))
      client.on('end', () => {
        console.log('client disconnected')
      })

      client.on('data', data => {
        const game = this._games.find(({clients}) => clients.indexOf(client) >= 0);
        if (!game) {
          client.write('Waiting for another player to join')
          return
        }

        const index = game.clients.indexOf(client)
        this.broadcast(game.clients, `Player ${index +1} ready!\r\n`)

        game.pendingTurns[index] = true
        if (Object.values(game.pendingTurns).length === 2) {
          this.broadcast(game.clients, 'Played round!\r\n')
          game.pendingTurns = {}
        }
      })
    });
  }

  broadcast(clients, message) {
    clients.forEach(function (client) {
      client.write(message)
    })
    process.stdout.write(message)
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
