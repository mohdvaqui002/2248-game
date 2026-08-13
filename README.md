# 2248 Game

A modern, highly polished number-merge puzzle game built with **React 18** and **Vite 6**. Connect matching and doubling tiles on a 7×5 grid, chain merges to gain multipliers, and use strategic power-ups to achieve massive scores.

**Repository:** [github.com/mohdvaqui002/2248-game](https://github.com/mohdvaqui002/2248-game)

**Play online:** [https://mohdvaqui002.github.io/2248-game/](https://mohdvaqui002.github.io/2248-game/)

---

## Key Features

- **Responsive Game Grid:** A smooth 7×5 grid styled with vibrant numbers and CSS variables.
- **Power-Ups & Utilities:**
  - **Undo (3 uses):** Revert the last move if you made a mistake.
  - **Shuffle (2 uses):** Rearrange the board to break deadlocks.
  - **Hammer (2 uses):** Select and smash any individual tile, replaced by a new random one.
- **Persistent State:** High scores, game statistics, and audio preferences are saved locally via browser `localStorage`.
- **Advanced Statistics Tracker:** Tracks your highest achieved tile, longest chain length, total number of merges, and total games played.
- **Dynamic Themes:** Toggle between **Dark**, **Light**, and **AMOLED Black** modes.
- **Audio Feedback:** Toggleable audio cues for selection, merges, and power-up usage.
- **Celebration Effects:** Confetti explosions powered by `canvas-confetti` when achieving big merges (1024 and above).

---

## Technical Overview & Mechanics

The game mechanics are implemented using React state variables and optimized grid indexing. Below is an overview of the core algorithms.

### 1. Connection & Validation Rules
The drag chain logic is governed by strict rules implemented in the `handleExtendChain` function:
- **Adjacency Check (Manhattan Distance):** Connection is allowed only between orthogonal neighbors (horizontal and vertical). Diagonal connections are not allowed as the code enforces:
  $$\Delta r + \Delta c = 1$$
- **Chaining Conditions:**
  - **First Link ($L = 1$):** The second tile must have the exact same value as the first tile:
    $$V_{next} = V_{last}$$
  - **Subsequent Links ($L > 1$):** The next tile value must be either equal to the last tile, or double the last tile's value:
    $$V_{next} = V_{last} \quad \text{or} \quad V_{next} = 2 \times V_{last}$$
    Additionally, the next tile value must be greater than or equal to the maximum value already in the chain to prevent connecting lower values late in the sequence:
    $$V_{next} \ge \max(V_{chain})$$
- **Backtracking:** Dragging back to the second-to-last tile in the chain safely shrinks the chain, allowing you to undo a misdrag.

### 2. Merge & Score Calculation
Upon releasing the drag chain:
- **New Tile Value:** The final tile in the chain receives the merged value, which is double the maximum value in the chain:
  $$V_{merged} = 2 \times \max(V_{chain})$$
- **Score Gained:** Points are awarded based on the merged value multiplied by the length of the chain:
  $$\text{Score Gained} = V_{merged} \times \text{Chain Length}$$

### 3. Gravity & Grid Refill
After a merge:
1. All tiles in the chain (except the last/target tile) are set to `null`.
2. Gravity is processed column-by-column: remaining tiles in each column fall downward.
3. Empty positions at the top of the column are refilled with new tiles containing values randomly selected from $[2, 4, 8, 16, 32, 64]$ according to the following probability weights:
   - $2$: 30%
   - $4$: 30%
   - $8$: 20%
   - $16$: 10%
   - $32$: 5%
   - $64$: 5%

### 4. Game Over Detection
After each move, the board is checked for valid remaining moves. The game is over when no two orthogonally adjacent tiles share the same value.

---

## Project Structure

```
2248-game/
├── Dockerfile              # Docker production image setup
├── index.html              # Entry HTML template
├── package.json            # Dependencies and scripts configuration
├── vite.config.js          # Vite build configuration
├── src/
│   ├── App.jsx              # Core game loop, state orchestration, and layouts
│   ├── main.jsx             # React framework entrypoint
│   ├── audio/
│   │   └── sound.js         # Sound synthesis and browser audio effects
│   ├── components/
│   │   ├── Grid.jsx         # Board renderer and mouse/touch drag event handlers
│   │   ├── Header.jsx       # Scoreboards, controls, theme, stats, and info buttons
│   │   ├── HowToPlayModal.jsx # Overlay tutorial
│   │   ├── PowerUps.jsx     # Power-up controls and counts
│   │   └── StatsModal.jsx   # Stats overlay (highest tile, merges, plays)
│   └── styles/
│       └── app.css          # Color palettes, responsive grids, and dark/light system
└── README.md
```

---

## Getting Started

### Prerequisites
- **Node.js** 18+ (Node 20+ recommended)
- **npm** (bundled with Node.js)

### Development Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/mohdvaqui002/2248-game.git
   cd 2248-game
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The development server runs on `http://localhost:5173/` by default.*

### Production Build & Preview
To build the application for hosting:
```bash
npm run build
npm run preview
```
The optimized production bundle will be generated inside the `dist/` directory.

### Running with Docker
You can also run the game in a containerized environment using Docker and Nginx:
```bash
# Build the Docker image
docker build -t game-2248 .

# Run the container
docker run -p 8080:80 game-2248
```
Then visit `http://localhost:8080/` in your browser.

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the Repository:** Create a personal fork of the project.
2. **Create a Feature Branch:** Choose a descriptive branch name (e.g., `feature/sound-effects-upgrade` or `bugfix/gravity-delay`).
3. **Commit Messages:** Follow standard git commit guidelines with clear, imperative summaries.
4. **Code Quality:** Ensure code is well-formatted, components are kept clean, and styles adhere to the existing CSS design tokens.
5. **Pull Requests:** Open a pull request targeting the `main` branch with a summary of changes and validation proof.

### Code of Conduct
- Be respectful and collaborative.
- Maintain a clean and readable codebase.
- Focus on performance, usability, and visual excellence.

---

## Contact & License

**Developer:** Mohd Vaqui ([github.com/mohdvaqui002](https://github.com/mohdvaqui002))

**License:** This project is provided as-is under the MIT License. Feel free to use, modify, and learn from it.
