const { BatalhaNaval } = require('../src/batalhaNaval');
const { fleetRow0, fleetRow5 } = require('./fixtures/placements');

describe('integração', () => {
  it('getShipsRemaining diminui após sunk', () => {
    const game = new BatalhaNaval({
      placements: { 1: fleetRow0, 2: fleetRow5 },
    });
    game.beginGame();
    expect(game.getShipsRemaining(2)).toBe(4);
    const sinkCarrier = [0, 1, 2, 3, 4];
    sinkCarrier.forEach((col, i) => {
      game.fire(5, col);
      if (i < sinkCarrier.length - 1) {
        game.fire(9, 9 - i);
      }
    });
    expect(game.getShipsRemaining(2)).toBe(3);
  });

  it('fluxo setup até primeiro hit', () => {
    const game = new BatalhaNaval();
    const { placeFullFleet } = require('./fixtures/placements');
    placeFullFleet(game, 1);
    placeFullFleet(game, 2);
    game.beginGame();
    const shot = game.fire(5, 0);
    expect(shot.changed).toBe(true);
    expect(['hit', 'miss', 'sunk', 'win']).toContain(shot.result);
  });
});