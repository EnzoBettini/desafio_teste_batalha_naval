const { ORIENTATION_HORIZONTAL, ORIENTATION_VERTICAL } = require('../../src/batalhaNaval');

const fleetRow0 = [
  { shipType: 'carrier', row: 0, col: 0, orientation: ORIENTATION_HORIZONTAL },
  { shipType: 'battleship', row: 1, col: 0, orientation: ORIENTATION_HORIZONTAL },
  { shipType: 'submarine', row: 2, col: 0, orientation: ORIENTATION_HORIZONTAL },
  { shipType: 'destroyer', row: 3, col: 0, orientation: ORIENTATION_HORIZONTAL },
];

const fleetRow5 = [
  { shipType: 'carrier', row: 5, col: 0, orientation: ORIENTATION_HORIZONTAL },
  { shipType: 'battleship', row: 6, col: 0, orientation: ORIENTATION_HORIZONTAL },
  { shipType: 'submarine', row: 7, col: 0, orientation: ORIENTATION_HORIZONTAL },
  { shipType: 'destroyer', row: 8, col: 0, orientation: ORIENTATION_HORIZONTAL },
];

const minimalDestroyerOnly = [
  { shipType: 'destroyer', row: 0, col: 0, orientation: ORIENTATION_HORIZONTAL },
];

function placeFullFleet(game, player) {
  const list = player === 1 ? fleetRow0 : fleetRow5;
  for (const p of list) {
    game.placeShip(player, p.shipType, p.row, p.col, p.orientation);
  }
}

module.exports = {
  fleetRow0,
  fleetRow5,
  minimalDestroyerOnly,
  placeFullFleet,
  ORIENTATION_VERTICAL,
};