# Connect 4 (4 em Linha) - Modern React Web Game

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/Styling-CSS3_Animations-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License](https://img.shields.io/badge/Academic-ISEC_LEI-green?style=for-the-badge)](#)

A fast, responsive, and interactive **Connect Four (4 em Linha)** web application built with **React 19** and bundled with **Vite**.

Developed as part of the **Scripting Languages (LS)** course in Computer Engineering at **ISEC (Instituto Superior de Engenharia de Coimbra)**.

---

## 📸 Preview

![Connect 4 Game Screenshot](screenshot.jpg)

---

## 🎮 Key Features

* **Multiple Game Modes:**
  * **Player vs Player (1v1 Local):** Play side-by-side with customizable names and token colors.
  * **Player vs AI (Bot):** Challenge the computer in single-player mode.
* **Dynamic Gameplay Mechanics:**
  * Interactive grid with smooth token-drop animations.
  * Special bonus cells on the board for strategic twists.
  * Real-time turn timer and score tracking.
* **Deterministic Win & Tie Checking:** Real-time diagonal, horizontal, and vertical 4-in-a-row detection algorithms.
* **Clean React Architecture:** Fully modular component tree (`GameBoard`, `PlayerSetup`), utilizing core React Hooks (`useState`, `useEffect`, `useRef`) for optimal render performance.

---

## 🛠️ Tech Stack

* **Frontend Library:** React 19
* **Build Tool:** Vite 6
* **Styling:** Custom CSS3 with flexbox/grid and smooth drop animations
* **Linting:** ESLint 9

---

## 🚀 Getting Started

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm** or **pnpm**

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/joaoblg/connect4-game.git
   cd connect4-game
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/`.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 👨‍💻 Author & Academic Context

* **João Bernardo Graça**

Developed as part of the **Degree in Computer Engineering (LEI)** - *Application Development (DA) branch* at **ISEC (Instituto Superior de Engenharia de Coimbra)**.
