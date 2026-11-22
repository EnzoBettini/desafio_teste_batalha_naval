const {
  assertInBounds,
  shipCells,
  allCellsInBounds,
  ORIENTATION_HORIZONTAL,
  ORIENTATION_VERTICAL,
  BOARD_SIZE,
} = require('../src/batalhaNaval');

describe('limites e shipCells', () => {
  it('assertInBounds aceita 0..9', () => {
    expect(() => assertInBounds(0, 0)).not.toThrow();
    expect(() => assertInBounds(9, 9)).not.toThrow();
  });

  it('assertInBounds rejeita fora', () => {
    expect(() => assertInBounds(10, 0)).toThrow(/bounds/i);
  });

  it('shipCells horizontal no tabuleiro', () => {
    const cells = shipCells(0, 0, 5, ORIENTATION_HORIZONTAL);
    expect(cells).toHaveLength(5);
    expect(allCellsInBounds(cells)).toBe(true);
    expect(cells[4]).toEqual({ row: 0, col: 4 });
  });

  it('shipCells vertical transborda', () => {
    const cells = shipCells(8, 0, 5, ORIENTATION_VERTICAL);
    expect(allCellsInBounds(cells)).toBe(false);
  });

  it('navio na borda direita cabe se couber', () => {
    const cells = shipCells(0, BOARD_SIZE - 2, 2, ORIENTATION_HORIZONTAL);
    expect(allCellsInBounds(cells)).toBe(true);
  });
});