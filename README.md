# tdd_node_card_game_war

This is a starter repository for programmers new to TDD, objects, and/or javascript.

Verify that you have a current version of node (e.g. > 8) installed.

If you have `nodenv`, simply execute
```
nodenv install 8.11.3
```

Either way, install the node packages:
```
npm install
```

The first assignment is to create a test-driven version of the card game of war.
The tests for the 4 classes identified by the spec files should all pass by running
```
npm test
```
AND

The manual system test
```
node warRunner.js
```
produces something like:
```
[… lots of stuff deleted …]
Player 2 took 4 of Hearts with 10 of Spades
Player 1 took 7 of Spades with K of Hearts
Player 1 took 4 of Hearts, 10 of Hearts, 10 of Spades with K of Hearts after a single tie
Winner: Player 1
```

Later assignments may add other interfaces to the game.
