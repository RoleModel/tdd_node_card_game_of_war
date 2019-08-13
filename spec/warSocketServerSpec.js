const net = require('net')
const WarSocketServer = require('../app/warSocketServer')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class MockWarSocketClient {
  constructor(port, connectOrError) {
    this.client = new net.Socket()

    this.client.connect(port, '0.0.0.0', connectOrError)

    this._received = []
    this.client.on('data', data => {
      data.toString().split('\r\n').forEach(message => {
        if (message.length > 0) {
          this._received.push(message)
        }
      })
    })

    this.client.on('error', connectOrError)
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
  const bogusPort = 1234
  beforeEach(() => {
    server = new WarSocketServer(bogusPort)
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

  // Add more tests to make sure the game is being played
  // For example:
  //   make sure the mock client gets appropriate output
  //   make sure the next round isn't played until both clients say they are ready to play
  //   ...
})
