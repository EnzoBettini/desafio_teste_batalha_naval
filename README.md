# desafio_teste_batalha_naval

Batalha naval **10×10**, dois jogadores, frota fixa. A suite em `tests/` especifica `src/batalhaNaval.js`.

## Frota (um de cada)

| `shipType` | Tamanho |
|------------|--------:|
| `carrier` | 5 |
| `battleship` | 4 |
| `submarine` | 3 |
| `destroyer` | 2 |

## Regras

| Tópico | Regra |
|--------|--------|
| Posicionamento | Fase `setup`; orientação `horizontal` ou `vertical`; sem sobreposição; dentro do tabuleiro |
| Início | `beginGame()` com frota completa dos dois jogadores → `playing`, jogador 1 atira primeiro |
| Tiro | `fire(row, col)` no tabuleiro do oponente; não repetir coordenada já atirada pelo jogador atual |
| Resultado | `miss`, `hit`, `sunk` (+ `shipType`), ou `win` (+ `winner`) |
| Fim | Fase `finished`; vitória ao afundar todos os navios adversários |

## API

```javascript
const bn = require('./src/batalhaNaval');
```

Constantes: `BOARD_SIZE`, `FLEET`, `PLAYER_ONE`, `PLAYER_TWO`, fases, orientações, estados de célula na view.

Funções puras: `assertInBounds`, `shipCells`, `canPlaceShip`, `allCellsInBounds`.

Classe **`BatalhaNaval`**: `placeShip`, `beginGame`, `fire`, `getPhase`, `getCurrentPlayer`, `isFleetComplete`, `hasAlreadyFired`, `getOpponentView`, `getOwnFleetView`, `getShipsRemaining`.

Construtor opcional: `{ placements: { 1: Placement[], 2: Placement[] } }`.

## Testes

`constantes-api`, `limites-bounds`, `posicionamento`, `frota-completa`, `inicio-partida`, `disparos`, `afundar-navio`, `vitoria`, `turnos`, `integracao-partida`, `fixtures/placements.js`

```bash
npm install
npm test
```

## Colaboradores

| Nome | RA |
|------|-----|
| Enzo Ayres Bettini | 241955272 |
| Gabriel Henrik de Castro Maia | _(a definir)_ |

Formulário: https://forms.gle/bgbV2TwrreR8LiAGA