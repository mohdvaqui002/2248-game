# 2248 Game

A number-merge puzzle game built with **React** and **Vite**. Connect matching (and doubling) tiles on a 7×5 grid, chain merges for high scores, and use power-ups to stay in the game.

**Repository:** [github.com/mohdvaqui002/2248-game](https://github.com/mohdvaqui002/2248-game)

**Play online:** [https://mohdvaqui002.github.io/2248-game/](https://mohdvaqui002.github.io/2248-game/)

---

## How to play

1. **Connect adjacent numbers** — Drag across tiles horizontally, vertically, or diagonally.
2. **Chaining** — Start with 2 or more identical numbers (e.g. `2 → 2`). Then continue with the same value **or** double it (`2 → 2 → 4 → 8 → 16`).
3. **Merge** — Release to merge connected tiles into the end tile and add to your score.
4. **Goal** — Keep merging to reach higher tiles and beat your high score. The game ends when no valid moves remain.

### Power-ups

| Power-up | Uses (start) | Effect |
|----------|--------------|--------|
| **Undo** | 3 | Revert the last move |
| **Shuffle** | 2 | Rearrange the board |
| **Hammer** | 2 | Remove a tile you select |

### Extra features

- High score saved in the browser (`localStorage`)
- Stats (highest tile, longest chain, total merges, games played)
- Dark / light theme toggle
- Optional sound effects
- Confetti celebration on big moments

---

## Tech stack

- [React 18](https://react.dev/)
- [Vite 6](https://vitejs.dev/)
- [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- [lucide-react](https://lucide.dev/) (icons)
- Docker + Nginx (optional production image)

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (recommended: 20)
- npm (comes with Node.js)

### Install & run (development)

```bash
# Clone the repo
git clone https://github.com/mohdvaqui002/2248-game.git
cd 2248-game

# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev
```

The dev server binds to `0.0.0.0:5173` so you can also open it from other devices on your network.

### Production build

```bash
npm run build
npm run preview
```

- `build` outputs static files to `dist/`
- `preview` serves the production build on port `5173`

---

## Docker

Build and run with Docker:

```bash
docker build -t game-2248 .
docker run -p 8080:80 game-2248
```

Then open **http://localhost:8080**.

The image builds the Vite app and serves it with **Nginx**.

---

## Project structure

```
2248-game/
├── Dockerfile
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── App.jsx              # Game logic, board, score, power-ups
│   ├── main.jsx             # React entry
│   ├── audio/
│   │   └── sound.js         # Sound helpers
│   ├── components/
│   │   ├── Grid.jsx
│   │   ├── Header.jsx
│   │   ├── HowToPlayModal.jsx
│   │   ├── PowerUps.jsx
│   │   └── StatsModal.jsx
│   └── styles/
│       └── app.css
└── README.md
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Create production build in `dist/` |
| `npm run preview` | Preview the production build |

---

## License

This project is provided as-is for learning and personal use.
