const {
  BatalhaNaval,
  PLAYER_ONE,
  CELL_SUNK,
  ORIENTATION_HORIZONTAL,
  PHASE_PLAYING,
} = require('../src/batalhaNaval');

describe('afundar navio', () => {
  it('sunk ao destruir destroyer adversário', () => {
    const game = new BatalhaNaval({
      placements: {
        1: [
          { shipType: 'carrier', row: 9, col: 0, orientation: ORIENTATION_HORIZONTAL },
          { shipType: 'battleship', row: 8, col: 0, orientation: ORIENTATION_HORIZONTAL },
          { shipType: 'submarine', row: 7, col: 0, orientation: ORIENTATION_HORIZONTAL },
          { shipType: 'destroyer', row: 6, col: 0, orientation: ORIENTATION_HORIZONTAL },
        ],
        2: [
          { shipType: 'carrier', row: 0, col: 0, orientation: ORIENTATION_HORIZONTAL },
          { shipType: 'battleship', row: 1, col: 0, orientation: ORIENTATION_HORIZONTAL },
          { shipType: 'submarine', row: 2, col: 0, orientation: ORIENTATION_HORIZONTAL },
          { shipType: 'destroyer', row: 3, col: 0, orientation: ORIENTATION_HORIZONTAL },
        ],
      },
    });
    game.beginGame();
    game.fire(9, 9);
    game.fire(9, 8);
    const r1 = game.fire(3, 0);
    expect(r1.result).toBe('hit');
    game.fire(9, 7);
    const r2 = game.fire(3, 1);
    expect(r2).toMatchObject({ changed: true, result: 'sunk', shipType: 'destroyer' });
    expect(game.getOpponentView(PLAYER_ONE)[3][0]).toBe(CELL_SUNK);
    expect(game.getOpponentView(PLAYER_ONE)[3][1]).toBe(CELL_SUNK);
    expect(game.getPhase()).toBe(PHASE_PLAYING);
  });
});