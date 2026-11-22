const {
  BatalhaNaval,
  PHASE_FINISHED,
  PLAYER_ONE,
  CELL_HIT,
  ORIENTATION_HORIZONTAL,
} = require('../src/batalhaNaval');

describe('vitória', () => {
  it('win ao afundar toda a frota adversária', () => {
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

    const targets = [];
    for (const ship of game.players[2].ships) {
      for (const cell of ship.cells) {
        targets.push([cell.row, cell.col]);
      }
    }
    let fillerRow = 8;
    let fillerCol = 9;
    let last = null;

    for (const [row, col] of targets) {
      while (game.getCurrentPlayer() === 2) {
        game.fire(fillerRow, fillerCol);
        fillerCol -= 1;
        if (fillerCol < 6) {
          fillerCol = 9;
          fillerRow -= 1;
        }
      }
      last = game.fire(row, col);
    }

    expect(last).toMatchObject({ changed: true, result: 'win', winner: PLAYER_ONE });
    expect(game.getPhase()).toBe(PHASE_FINISHED);
    expect(game.fire(0, 0)).toEqual({ changed: false });
  });

  it('getOwnFleetView mostra hits recebidos', () => {
    const game = new BatalhaNaval({
      placements: {
        1: [
          { shipType: 'carrier', row: 9, col: 0, orientation: ORIENTATION_HORIZONTAL },
          { shipType: 'battleship', row: 8, col: 0, orientation: ORIENTATION_HORIZONTAL },
          { shipType: 'submarine', row: 7, col: 0, orientation: ORIENTATION_HORIZONTAL },
          { shipType: 'destroyer', row: 0, col: 0, orientation: ORIENTATION_HORIZONTAL },
        ],
        2: [
          { shipType: 'carrier', row: 5, col: 0, orientation: ORIENTATION_HORIZONTAL },
          { shipType: 'battleship', row: 6, col: 0, orientation: ORIENTATION_HORIZONTAL },
          { shipType: 'submarine', row: 7, col: 0, orientation: ORIENTATION_HORIZONTAL },
          { shipType: 'destroyer', row: 9, col: 0, orientation: ORIENTATION_HORIZONTAL },
        ],
      },
    });
    game.beginGame();
    game.fire(0, 0);
    game.fire(0, 0);
    expect(game.getOwnFleetView(PLAYER_ONE)[0][0]).toBe(CELL_HIT);
  });
});