const Deck = require('../app/deck');

describe('Deck', () => {
  it('has 52 cards when created', () => {
    const deck = new Deck();
    expect(deck.cardsLeft()).toEqual(52);
  });

  it('deals the top card', () => {
    const deck = new Deck();
    const card = deck.deal();
    expect(card).toBeDefined();
    expect(deck.cardsLeft()).toEqual(51);
  });
});
