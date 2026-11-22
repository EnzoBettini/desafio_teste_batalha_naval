const bn = require('../src/batalhaNaval');

describe('constantes e API', () => {
  it('BOARD_SIZE e FLEET do enunciado', () => {
    expect(bn.BOARD_SIZE).toBe(10);
    expect(bn.FLEET).toHaveLength(4);
    const sizes = Object.fromEntries(bn.FLEET.map((s) => [s.shipType, s.size]));
    expect(sizes).toEqual({
      carrier: 5,
      battleship: 4,
      submarine: 3,
      destroyer: 2,
    });
  });

  it('exporta BatalhaNaval e helpers', () => {
    expect(typeof bn.BatalhaNaval).toBe('function');
    expect(typeof bn.shipCells).toBe('function');
    expect(typeof bn.canPlaceShip).toBe('function');
    expect(typeof bn.assertInBounds).toBe('function');
  });
});