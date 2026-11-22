const {
  BatalhaNaval,
  PHASE_PLAYING,
  PHASE_SETUP,
  PLAYER_ONE,
} = require('../src/batalhaNaval');
const { placeFullFleet } = require('./fixtures/placements');

describe('início da partida', () => {
  it('beginGame falha se frotas incompletas', () => {
    const game = new BatalhaNaval();
    placeFullFleet(game, PLAYER_ONE);
    expect(game.beginGame()).toEqual({ ok: false, reason: 'incomplete_fleet' });
  });

  it('beginGame inicia com duas frotas', () => {
    const game = new BatalhaNaval();
    placeFullFleet(game, PLAYER_ONE);
    placeFullFleet(game, 2);
    expect(game.beginGame()).toEqual({ ok: true });
    expect(game.getPhase()).toBe(PHASE_PLAYING);
    expect(game.getCurrentPlayer()).toBe(PLAYER_ONE);
  });

  it('placeShip bloqueado após início', () => {
    const game = new BatalhaNaval();
    placeFullFleet(game, PLAYER_ONE);
    placeFullFleet(game, 2);
    game.beginGame();
    const r = game.placeShip(PLAYER_ONE, 'carrier', 9, 0, 'horizontal');
    expect(r.reason).toBe('not_setup');
  });
});