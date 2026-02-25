# Tower of Hanoi Solver

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3.x-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-Frontend-F7DF1E?logo=javascript&logoColor=000)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-informational)](./LICENSE)

A full-stack visualization system for solving and animating the Tower of Hanoi puzzle. The backend computes optimal move sequences using recursion; the frontend renders and animates those moves on an SVG canvas with synchronized explanatory guidance.

## Live Demo

Add your deployed URL here:

- `https://<your-demo-url>`

## Architecture

```text
User Input (N, speed)
        |
        v
Frontend (hanoi.js)
  - POST /solve via fetch()
  - Receives move list
  - Animates SVG state transitions
  - Updates explanation sidebar
        |
        v
Backend (Flask)
  app.py -> /solve
        |
        v
Recursive Solver (solver/hanoi_solver.py)
  - Generates optimal move sequence
```

## Algorithmic Complexity

For `N` disks:

- Time complexity: `O(2^N)`
- Space complexity: `O(N)` recursion depth

The solver returns the canonical optimal sequence of `2^N - 1` moves.

## Backend-Frontend Interaction

1. Client reads disk count from the UI.
2. Client sends `POST /solve` with JSON payload:

```json
{ "disks": 4 }
```

3. Flask validates input bounds and invokes the recursive solver.
4. API responds with ordered move tuples:

```json
{
  "moves": [[1,0,1],[2,0,2],[1,1,2], ...]
}
```

5. Frontend consumes the move stream and performs deterministic SVG updates per step.

## Tech Stack

- Backend: Python, Flask
- Solver: Recursive divide-and-conquer implementation
- Frontend: Vanilla JavaScript, HTML, CSS
- Rendering: SVG-based disk/peg visualization
- Transport: REST API (`fetch`, JSON)

## Local Setup

### 1) Clone and enter project

```bash
git clone <repo-url>
cd tower-of-hanoi-solver
```

### 2) Create and activate virtual environment

```bash
python -m venv venv
```

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

macOS/Linux:

```bash
source venv/bin/activate
```

### 3) Install dependencies

```bash
pip install -r requirements.txt
```

### 4) Run server

```bash
python app.py
```

Open `http://127.0.0.1:5000`.

## Project Structure

```text
tower-of-hanoi-solver/
+-- app.py
+-- solver/
¦   +-- hanoi_solver.py
+-- templates/
¦   +-- index.html
+-- static/
¦   +-- css/
¦   ¦   +-- style.css
¦   +-- js/
¦       +-- hanoi.js
+-- requirements.txt
```

## Engineering Concepts Demonstrated

- Recursive problem decomposition with strict optimality constraints
- Separation of concerns across API, solver logic, and UI renderer
- Stateless API design with deterministic client-side replay
- Input validation and bounded execution safeguards
- UI-state synchronization between algorithmic steps and explanatory narrative

## API Contract

### `POST /solve`

Request:

```json
{ "disks": 3 }
```

Responses:

- `200 OK`: move sequence payload
- `400 Bad Request`: invalid disk count
- `500 Internal Server Error`: unexpected server error

---

If you deploy this project, replace the demo and repository placeholders with production URLs.