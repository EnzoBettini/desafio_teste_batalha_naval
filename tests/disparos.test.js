const {
  BatalhaNaval,
  PLAYER_ONE,
  PLAYER_TWO,
  CELL_MISS,
  CELL_HIT,
  CELL_UNKNOWN,
} = require('../src/batalhaNaval');
const { placeFullFleet } = require('./fixtures/placements');

function startStandardGame() {
  const game = new BatalhaNaval();
  placeFullFleet(game, PLAYER_ONE);
  placeFullFleet(game, PLAYER_TWO);
  game.beginGame();
  return game;
}

describe('disparos', () => {
  it('miss em água', () => {
    const game = startStandardGame();
    const r = game.fire(9, 9);
    expect(r).toMatchObject({ changed: true, result: 'miss' });
    expect(game.getOpponentView(PLAYER_ONE)[9][9]).toBe(CELL_MISS);
  });

  it('hit no navio adversário', () => {
    const game = startStandardGame();
    const r = game.fire(5, 0);
    expect(r).toMatchObject({ changed: true, result: 'hit' });
    expect(game.getOpponentView(PLAYER_ONE)[5][0]).toBe(CELL_HIT);
  });

  it('não permite repetir tiro do mesmo jogador', () => {
    const game = startStandardGame();
    game.fire(9, 9);
    game.fire(9, 8);
    expect(game.fire(9, 9)).toEqual({ changed: false, reason: 'already_fired' });
  });

  it('hasAlreadyFired reflete tiros do jogador atual', () => {
    const game = startStandardGame();
    expect(game.hasAlreadyFired(9, 9)).toBe(false);
    game.fire(9, 9);
    game.getCurrentPlayer(); // now P2
    expect(game.hasAlreadyFired(9, 9)).toBe(false);
  });

  it('célula não atirada permanece unknown na view', () => {
    const game = startStandardGame();
    expect(game.getOpponentView(PLAYER_ONE)[0][8]).toBe(CELL_UNKNOWN);
  });
});