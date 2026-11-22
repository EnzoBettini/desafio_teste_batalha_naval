const { BatalhaNaval, PLAYER_ONE, PLAYER_TWO } = require('../src/batalhaNaval');
const { placeFullFleet } = require('./fixtures/placements');

describe('alternância de turnos', () => {
  it('após tiro alterna jogador', () => {
    const game = new BatalhaNaval();
    placeFullFleet(game, PLAYER_ONE);
    placeFullFleet(game, PLAYER_TWO);
    game.beginGame();
    expect(game.getCurrentPlayer()).toBe(PLAYER_ONE);
    game.fire(9, 9);
    expect(game.getCurrentPlayer()).toBe(PLAYER_TWO);
    game.fire(9, 9);
    expect(game.getCurrentPlayer()).toBe(PLAYER_ONE);
  });
});