const WarSocketServer = require('./WarSocketServer.js');

const server = new WarSocketServer(1337);
server.start();
