const {
  BatalhaNaval,
  canPlaceShip,
  createEmptyOccupied,
  ORIENTATION_HORIZONTAL,
  ORIENTATION_VERTICAL,
  PLAYER_ONE,
} = require('../src/batalhaNaval');

describe('posicionamento', () => {
  it('canPlaceShip detecta sobreposição', () => {
    const occupied = createEmptyOccupied();
    occupied.add('0,0');
    occupied.add('0,1');
    expect(canPlaceShip(occupied, 0, 0, 3, ORIENTATION_HORIZONTAL)).toBe(false);
    expect(canPlaceShip(occupied, 1, 0, 3, ORIENTATION_HORIZONTAL)).toBe(true);
  });

  it('placeShip válido', () => {
    const game = new BatalhaNaval();
    const r = game.placeShip(PLAYER_ONE, 'destroyer', 0, 0, ORIENTATION_HORIZONTAL);
    expect(r).toEqual({ changed: true });
  });

  it('rejeita fora do tabuleiro', () => {
    const game = new BatalhaNaval();
    const r = game.placeShip(PLAYER_ONE, 'carrier', 0, 6, ORIENTATION_HORIZONTAL);
    expect(r.changed).toBe(false);
    expect(r.reason).toBe('invalid_placement');
  });

  it('rejeita orientação inválida', () => {
    const game = new BatalhaNaval();
    const r = game.placeShip(PLAYER_ONE, 'destroyer', 0, 0, 'diagonal');
    expect(r.changed).toBe(false);
  });

  it('rejeita vertical que ultrapassa linhas', () => {
    const game = new BatalhaNaval();
    const r = game.placeShip(PLAYER_ONE, 'carrier', 6, 0, ORIENTATION_VERTICAL);
    expect(r.changed).toBe(false);
  });
});