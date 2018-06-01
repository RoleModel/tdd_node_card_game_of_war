const WarGame = require('./warGame.js');

const game = new WarGame();
game.start();
while (!game.winner()) {
  console.log(game.playRound());
}
console.log(`Winner: ${game.winner().name()}`)
