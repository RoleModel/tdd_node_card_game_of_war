const net = require('net')
const WarSocketServer = require('../app/warSocketServer')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class MockWarSocketClient {
  constructor(port, connectOrError) {
    this.client = new net.Socket()
    this.client.connect(port, '0.0.0.0', connectOrError)
    this.client.on('error', connectOrError)

    this._received = []
    this.client.on('data', this._parseData.bind(this))
  }

  _parseData(data) {
    data.toString().split('\r\n').forEach(message => {
      if (message.length > 0) {
        this._received.push(message)
      }
    })
  }

  sendReady() {
    this.client.write("\n")
  }

  async captureOutput(numberOfMessages) {
    while (this._received.length < numberOfMessages) {
      await sleep(100)
      continue
    }

    return this._received.splice(0, numberOfMessages)
  }
}

describe('WarSocketServer', () => {
  beforeEach(() => {
    server = new WarSocketServer(1234)
  })

  afterEach(() => {
    server.stop()
  })

  it('is not listening on a port before it is started', done => {
    new MockWarSocketClient(server.portNumber(), error => {
      expect(error).toMatch('ECONNREFUSED')
      done()
    })
  })

  it('accepts new clients and starts a game of possible', async () => {
    server.start()

    const client1 = new MockWarSocketClient(server.portNumber(), () => {})
    const [message1] = await client1.captureOutput(1)
    expect(message1).toMatch('Waiting')
    expect(server.games().length).toBe(0)

    const client2 = new MockWarSocketClient(server.portNumber(), () => { })
    const [ message2 ] = await client2.captureOutput(1)
    expect(message2).toMatch('go to war')
    expect(server.games().length).toBe(1)
  })

  it("tells pending player that he's waiting", async () => {
    server.start()

    const client1 = new MockWarSocketClient(server.portNumber(), () => {})
    const [message1] = await client1.captureOutput(1)
    expect(message1).toMatch('Waiting')
    expect(server.games().length).toBe(0)

    const client2 = new MockWarSocketClient(server.portNumber(), () => { })
    const [ message2 ] = await client2.captureOutput(1)
    expect(message2).toMatch('go to war')
    expect(server.games().length).toBe(1)

    const client3 = new MockWarSocketClient(server.portNumber(), () => { })
    const [ message3 ] = await client3.captureOutput(1)
    expect(message3).toMatch('Waiting')
    expect(server.games().length).toBe(1)
  })

  describe('game started', () => {
    beforeEach(() => {
      clients = []
      server.start()

      const client1 = new MockWarSocketClient(server.portNumber(), () => { })
      clients.push(client1)

      const client2 = new MockWarSocketClient(server.portNumber(), () => { })
      clients.push(client2)
    })

    it('Tells each player how many cards they have left', async () => {
      for (let i = 0; i < clients.length; i++) {
        const messages = await clients[i].captureOutput(2)
        expect(messages[1]).toMatch('You have 26 cards left')
      }
    })

    it('waits for both players to play a round', async () => {
      let messages = []
      messages = await clients[0].captureOutput(2)
      expect(messages[1]).toMatch('You have 26 cards left')
      messages = await clients[1].captureOutput(2)
      expect(messages[1]).toMatch('You have 26 cards left')

      clients[0].sendReady()
      const [message3] = await clients[0].captureOutput(1)
      expect(message3).toMatch('Player 1 ready')
      const [message4] = await clients[1].captureOutput(1)
      expect(message3).toMatch('Player 1 ready')

      clients[1].sendReady()
      messages = await clients[0].captureOutput(2)
      expect(messages[0]).toMatch('Player 2 ready')
      expect(messages[1]).toMatch('Played round')
      messages = await clients[1].captureOutput(2)
      expect(messages[0]).toMatch('Player 2 ready')
      expect(messages[1]).toMatch('Played round')
    })
  })
})
