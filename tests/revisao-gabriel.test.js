const {
  BatalhaNaval,
  PLAYER_ONE,
  PLAYER_TWO,
  PHASE_PLAYING,
  PHASE_FINISHED,
  CELL_HIT,
  CELL_MISS,
  CELL_SUNK,
  CELL_UNKNOWN,
  CELL_WATER,
  CELL_SHIP,
  ORIENTATION_HORIZONTAL,
  FLEET_BY_TYPE,
  shipCells,
} = require('../src/batalhaNaval');
const { fleetRow0, fleetRow5 } = require('./fixtures/placements');

function shipCellsOf(placements) {
  return placements.flatMap((p) =>
    shipCells(p.row, p.col, FLEET_BY_TYPE[p.shipType], p.orientation).map((c) => [c.row, c.col]),
  );
}

function startGame() {
  const game = new BatalhaNaval({ placements: { 1: fleetRow0, 2: fleetRow5 } });
  game.beginGame();
  return game;
}

function playerOneMissCells() {
  const cells = [];
  for (const row of [9, 4]) {
    for (let col = 9; col >= 0; col -= 1) cells.push([row, col]);
  }
  return cells;
}

function playUntilPlayerTwoWins(game) {
  const misses = playerOneMissCells();
  const p1Misses = [];
  let last = null;
  for (const [row, col] of shipCellsOf(fleetRow0)) {
    const miss = misses.shift();
    expect(game.fire(miss[0], miss[1])).toEqual({ changed: true, result: 'miss' });
    p1Misses.push(miss);
    last = game.fire(row, col);
  }
  return { last, p1Misses };
}

describe('revisão Gabriel — casos de borda', () => {
  it('porta-aviões só afunda na última célula; antes disso cada acerto é hit sem shipType', () => {
    const game = startGame();
    const carrier = shipCellsOf([fleetRow5[0]]);
    const p2Misses = [[9, 9], [9, 8], [9, 7], [9, 6], [9, 5]];

    carrier.slice(0, 4).forEach(([row, col], i) => {
      expect(game.fire(row, col)).toEqual({ changed: true, result: 'hit' });
      expect(game.getShipsRemaining(PLAYER_TWO)).toBe(4);
      expect(game.getOpponentView(PLAYER_ONE)[row][col]).toBe(CELL_HIT);
      game.fire(...p2Misses[i]);
    });
    expect(game.getOpponentView(PLAYER_ONE)[5][4]).toBe(CELL_UNKNOWN);

    const [lastRow, lastCol] = carrier[4];
    expect(game.fire(lastRow, lastCol)).toEqual({
      changed: true,
      result: 'sunk',
      shipType: 'carrier',
    });
    expect(game.getShipsRemaining(PLAYER_TWO)).toBe(3);
    for (const [row, col] of carrier) {
      expect(game.getOpponentView(PLAYER_ONE)[row][col]).toBe(CELL_SUNK);
    }
    expect(game.getPhase()).toBe(PHASE_PLAYING);
  });

  it('tiro repetido não consome o turno do atacante', () => {
    const game = startGame();
    game.fire(9, 9);
    game.fire(9, 9);
    expect(game.getCurrentPlayer()).toBe(PLAYER_ONE);

    expect(game.fire(9, 9)).toEqual({ changed: false, reason: 'already_fired' });
    expect(game.getCurrentPlayer()).toBe(PLAYER_ONE);

    expect(game.fire(9, 8)).toMatchObject({ changed: true, result: 'miss' });
    expect(game.getCurrentPlayer()).toBe(PLAYER_TWO);
  });

  it('jogador 2 vence com tiros intercalados e vê toda a frota do jogador 1 como sunk', () => {
    const game = startGame();
    const { last, p1Misses } = playUntilPlayerTwoWins(game);

    expect(last).toEqual({
      changed: true,
      result: 'win',
      shipType: 'destroyer',
      winner: PLAYER_TWO,
    });
    expect(game.getPhase()).toBe(PHASE_FINISHED);
    expect(game.getShipsRemaining(PLAYER_ONE)).toBe(0);
    expect(game.getShipsRemaining(PLAYER_TWO)).toBe(4);

    const p2View = game.getOpponentView(PLAYER_TWO);
    for (const [row, col] of shipCellsOf(fleetRow0)) {
      expect(p2View[row][col]).toBe(CELL_SUNK);
    }
    const p1View = game.getOpponentView(PLAYER_ONE);
    for (const [row, col] of p1Misses) {
      expect(p1View[row][col]).toBe(CELL_MISS);
    }
  });

  it('após finished, fire, placeShip e beginGame não alteram a partida', () => {
    const game = startGame();
    playUntilPlayerTwoWins(game);
    const viewBefore = game.getOpponentView(PLAYER_ONE);

    expect(game.fire(5, 0)).toEqual({ changed: false });
    expect(game.fire(0, 9)).toEqual({ changed: false });
    expect(
      game.placeShip(PLAYER_ONE, 'carrier', 9, 0, ORIENTATION_HORIZONTAL),
    ).toMatchObject({ changed: false });
    expect(
      game.placeShip(PLAYER_TWO, 'destroyer', 0, 8, ORIENTATION_HORIZONTAL),
    ).toMatchObject({ changed: false });
    expect(game.beginGame()).toMatchObject({ ok: false });

    expect(game.getPhase()).toBe(PHASE_FINISHED);
    expect(game.getOpponentView(PLAYER_ONE)).toEqual(viewBefore);
    expect(game.getShipsRemaining(PLAYER_TWO)).toBe(4);
  });

  it('views são isoladas por jogador: tiro do P1 não aparece na visão do P2', () => {
    const game = startGame();
    game.fire(5, 0);
    game.fire(9, 9);

    expect(game.getOpponentView(PLAYER_ONE)[5][0]).toBe(CELL_HIT);
    expect(game.getOwnFleetView(PLAYER_TWO)[5][0]).toBe(CELL_HIT);
    expect(game.getOwnFleetView(PLAYER_TWO)[5][1]).toBe(CELL_SHIP);

    expect(game.getOpponentView(PLAYER_TWO)[5][0]).toBe(CELL_UNKNOWN);
    expect(game.getOpponentView(PLAYER_TWO)[9][9]).toBe(CELL_MISS);
    expect(game.getOwnFleetView(PLAYER_ONE)[5][0]).toBe(CELL_WATER);
    expect(game.getOwnFleetView(PLAYER_ONE)[0][0]).toBe(CELL_SHIP);
  });
});
