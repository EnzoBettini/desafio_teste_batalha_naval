const BOARD_SIZE = 10;

const ORIENTATION_HORIZONTAL = 'horizontal';
const ORIENTATION_VERTICAL = 'vertical';

const PHASE_SETUP = 'setup';
const PHASE_PLAYING = 'playing';
const PHASE_FINISHED = 'finished';

const PLAYER_ONE = 1;
const PLAYER_TWO = 2;

const FLEET = [
  { shipType: 'carrier', size: 5 },
  { shipType: 'battleship', size: 4 },
  { shipType: 'submarine', size: 3 },
  { shipType: 'destroyer', size: 2 },
];

const FLEET_BY_TYPE = Object.fromEntries(FLEET.map((s) => [s.shipType, s.size]));

const CELL_UNKNOWN = 'unknown';
const CELL_MISS = 'miss';
const CELL_HIT = 'hit';
const CELL_SUNK = 'sunk';
const CELL_WATER = 'water';
const CELL_SHIP = 'ship';

function assertInBounds(row, col) {
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
    throw new Error(`Out of bounds: (${row}, ${col})`);
  }
}

function cellKey(row, col) {
  return `${row},${col}`;
}

function shipCells(row, col, size, orientation) {
  const cells = [];
  for (let i = 0; i < size; i += 1) {
    if (orientation === ORIENTATION_HORIZONTAL) {
      cells.push({ row, col: col + i });
    } else if (orientation === ORIENTATION_VERTICAL) {
      cells.push({ row: row + i, col });
    } else {
      return null;
    }
  }
  return cells;
}

function allCellsInBounds(cells) {
  if (!cells) return false;
  return cells.every(
    (c) => c.row >= 0 && c.row < BOARD_SIZE && c.col >= 0 && c.col < BOARD_SIZE,
  );
}

function canPlaceShip(occupiedSet, row, col, size, orientation) {
  const cells = shipCells(row, col, size, orientation);
  if (!allCellsInBounds(cells)) return false;
  return cells.every((c) => !occupiedSet.has(cellKey(c.row, c.col)));
}

function createEmptyOccupied() {
  return new Set();
}

function createPlayerState() {
  return {
    ships: [],
    hitsReceived: new Set(),
    shotsFired: new Set(),
  };
}

function buildShipRecord(shipType, row, col, orientation) {
  const size = FLEET_BY_TYPE[shipType];
  const cells = shipCells(row, col, size, orientation);
  return {
    shipType,
    row,
    col,
    orientation,
    cells,
    hits: new Set(),
  };
}

function isShipSunk(ship) {
  return ship.hits.size === ship.cells.length;
}

class BatalhaNaval {
  constructor(options = {}) {
    this.phase = PHASE_SETUP;
    this.currentPlayer = PLAYER_ONE;
    this.winner = null;
    this.players = {
      [PLAYER_ONE]: createPlayerState(),
      [PLAYER_TWO]: createPlayerState(),
    };

    if (options.placements) {
      for (const player of [PLAYER_ONE, PLAYER_TWO]) {
        const list = options.placements[player] || [];
        for (const p of list) {
          this.placeShip(player, p.shipType, p.row, p.col, p.orientation);
        }
      }
    }
  }

  getPhase() {
    return this.phase;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  _occupiedSet(player) {
    const set = createEmptyOccupied();
    for (const ship of this.players[player].ships) {
      for (const c of ship.cells) {
        set.add(cellKey(c.row, c.col));
      }
    }
    return set;
  }

  isFleetComplete(player) {
    const types = new Set(this.players[player].ships.map((s) => s.shipType));
    return FLEET.every((f) => types.has(f.shipType));
  }

  placeShip(player, shipType, row, col, orientation) {
    if (this.phase !== PHASE_SETUP) {
      return { changed: false, reason: 'not_setup' };
    }
    if (!FLEET_BY_TYPE[shipType]) {
      return { changed: false, reason: 'invalid_type' };
    }
    if (this.players[player].ships.some((s) => s.shipType === shipType)) {
      return { changed: false, reason: 'duplicate_type' };
    }
    const size = FLEET_BY_TYPE[shipType];
    const occupied = this._occupiedSet(player);
    if (!canPlaceShip(occupied, row, col, size, orientation)) {
      return { changed: false, reason: 'invalid_placement' };
    }
    this.players[player].ships.push(buildShipRecord(shipType, row, col, orientation));
    return { changed: true };
  }

  beginGame() {
    if (this.phase !== PHASE_SETUP) {
      return { ok: false, reason: 'wrong_phase' };
    }
    if (!this.isFleetComplete(PLAYER_ONE) || !this.isFleetComplete(PLAYER_TWO)) {
      return { ok: false, reason: 'incomplete_fleet' };
    }
    this.phase = PHASE_PLAYING;
    this.currentPlayer = PLAYER_ONE;
    return { ok: true };
  }

  hasAlreadyFired(row, col) {
    if (this.phase !== PHASE_PLAYING) return true;
    const player = this.players[this.currentPlayer];
    return player.shotsFired.has(cellKey(row, col));
  }

  _opponentOf(player) {
    return player === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
  }

  _findShipAt(player, row, col) {
    const key = cellKey(row, col);
    for (const ship of this.players[player].ships) {
      if (ship.cells.some((c) => cellKey(c.row, c.col) === key)) {
        return ship;
      }
    }
    return null;
  }

  getShipsRemaining(player) {
    return this.players[player].ships.filter((s) => !isShipSunk(s)).length;
  }

  fire(row, col) {
    if (this.phase !== PHASE_PLAYING) {
      return { changed: false };
    }
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
      return { changed: false };
    }

    const attacker = this.currentPlayer;
    const defender = this._opponentOf(attacker);
    const key = cellKey(row, col);

    if (this.players[attacker].shotsFired.has(key)) {
      return { changed: false, reason: 'already_fired' };
    }

    this.players[attacker].shotsFired.add(key);

    const targetShip = this._findShipAt(defender, row, col);
    if (!targetShip) {
      this._advanceTurn();
      return { changed: true, result: 'miss' };
    }

    targetShip.hits.add(key);
    this.players[defender].hitsReceived.add(key);

    if (isShipSunk(targetShip)) {
      const remaining = this.getShipsRemaining(defender);
      if (remaining === 0) {
        this.phase = PHASE_FINISHED;
        this.winner = attacker;
        return {
          changed: true,
          result: 'win',
          shipType: targetShip.shipType,
          winner: attacker,
        };
      }
      this._advanceTurn();
      return { changed: true, result: 'sunk', shipType: targetShip.shipType };
    }

    this._advanceTurn();
    return { changed: true, result: 'hit' };
  }

  _advanceTurn() {
    this.currentPlayer = this._opponentOf(this.currentPlayer);
  }

  getOpponentView(player) {
    const opponent = this._opponentOf(player);
    const attackerShots = this.players[player].shotsFired;
    const grid = Array.from({ length: BOARD_SIZE }, () =>
      Array(BOARD_SIZE).fill(CELL_UNKNOWN),
    );

    for (const ship of this.players[opponent].ships) {
      if (!isShipSunk(ship)) continue;
      for (const c of ship.cells) {
        grid[c.row][c.col] = CELL_SUNK;
      }
    }

    for (const key of attackerShots) {
      const [row, col] = key.split(',').map(Number);
      if (grid[row][col] === CELL_SUNK) continue;
      const ship = this._findShipAt(opponent, row, col);
      if (ship) {
        grid[row][col] = CELL_HIT;
      } else {
        grid[row][col] = CELL_MISS;
      }
    }

    return grid;
  }

  getOwnFleetView(player) {
    const grid = Array.from({ length: BOARD_SIZE }, () =>
      Array(BOARD_SIZE).fill(CELL_WATER),
    );
    for (const ship of this.players[player].ships) {
      for (const c of ship.cells) {
        const key = cellKey(c.row, c.col);
        if (this.players[player].hitsReceived.has(key)) {
          grid[c.row][c.col] = CELL_HIT;
        } else {
          grid[c.row][c.col] = CELL_SHIP;
        }
      }
    }
    return grid;
  }
}

module.exports = {
  BOARD_SIZE,
  FLEET,
  FLEET_BY_TYPE,
  ORIENTATION_HORIZONTAL,
  ORIENTATION_VERTICAL,
  PHASE_SETUP,
  PHASE_PLAYING,
  PHASE_FINISHED,
  PLAYER_ONE,
  PLAYER_TWO,
  CELL_UNKNOWN,
  CELL_MISS,
  CELL_HIT,
  CELL_SUNK,
  CELL_WATER,
  CELL_SHIP,
  BatalhaNaval,
  assertInBounds,
  shipCells,
  canPlaceShip,
  allCellsInBounds,
  createEmptyOccupied,
};