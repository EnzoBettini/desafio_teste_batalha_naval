const { BatalhaNaval, PLAYER_ONE, PLAYER_TWO } = require('../src/batalhaNaval');
const { placeFullFleet } = require('./fixtures/placements');

describe('frota completa', () => {
  it('isFleetComplete false com frota parcial', () => {
    const game = new BatalhaNaval();
    game.placeShip(PLAYER_ONE, 'destroyer', 0, 0, 'horizontal');
    expect(game.isFleetComplete(PLAYER_ONE)).toBe(false);
  });

  it('frota completa após quatro navios', () => {
    const game = new BatalhaNaval();
    placeFullFleet(game, PLAYER_ONE);
    expect(game.isFleetComplete(PLAYER_ONE)).toBe(true);
  });

  it('não permite duplicar tipo', () => {
    const game = new BatalhaNaval();
    game.placeShip(PLAYER_ONE, 'destroyer', 0, 0, 'horizontal');
    const r = game.placeShip(PLAYER_ONE, 'destroyer', 5, 0, 'horizontal');
    expect(r).toEqual({ changed: false, reason: 'duplicate_type' });
  });

  it('constructor com placements monta frota', () => {
    const { fleetRow0, fleetRow5 } = require('./fixtures/placements');
    const game = new BatalhaNaval({
      placements: { 1: fleetRow0, 2: fleetRow5 },
    });
    expect(game.isFleetComplete(PLAYER_ONE)).toBe(true);
    expect(game.isFleetComplete(PLAYER_TWO)).toBe(true);
  });
});