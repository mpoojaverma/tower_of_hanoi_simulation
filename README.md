# Tower of Hanoi Solver

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3.x-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-Frontend-F7DF1E?logo=javascript&logoColor=000)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Deploy](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=000)](https://render.com/)

## Live Demo

https://tower-of-hanoi-solver.onrender.com

## Overview

A full-stack Tower of Hanoi visualization system. The backend computes the optimal recursive move sequence and exposes it via `/solve`; the frontend replays that sequence with SVG animation and synchronized step explanations.

## Preview

<video src="screenshots/demo.mp4" controls width="900"></video>


## Architecture

```text
User Input (disk count, speed)
        |
        v
Frontend (static/js/hanoi.js)
  - Sends POST /solve using fetch()
  - Receives ordered move sequence
  - Updates SVG disk positions per step
  - Updates explanation sidebar
        |
        v
Backend (app.py)
  - GET /
  - POST /solve
        |
        v
Solver (solver/hanoi_solver.py)
  - Recursive move generation
  - Optimal sequence: 2^N - 1 moves
```

## Algorithmic Complexity

For `N` disks:

- Time complexity: `O(2^N)`
- Space complexity: `O(N)`

## Tech Stack

- Python 3.10+
- Flask
- Gunicorn
- Vanilla JavaScript
- HTML/CSS
- SVG
- Render

## Local Setup

### 1) Clone

```bash
git clone <repo-url>
cd tower-of-hanoi-solver
```

### 2) Create and activate virtual environment

```bash
python -m venv venv
```

### 3) Install dependencies

```bash
pip install -r requirements.txt
```

### 4) Run

```bash
python app.py
```

Open: `http://127.0.0.1:5000`

## Deployment

Deployed on Render with Gunicorn.

## Project Structure

```text
tower-of-hanoi-solver/
-- app.py
-- solver/
   +-- __init__.py
   +-- hanoi_solver.py
+-- templates/
   +-- index.html
+-- static/
   +-- css/
      +-- style.css
   +-- js/
      +-- hanoi.js
+-- screenshots/
   +-- demo.mp4
   +-- tower of hanoi.jpeg
+-- requirements.txt
+-- README.md
```

## Responses

- `200 OK`: move sequence payload
- `400 Bad Request`: invalid disk count
- `500 Internal Server Error`: unexpected server error

## Screenshots

GUI previews (.jpeg and .mp4) are available in the screenshots/ directory.

## Educational Context

Developed as part of Data Structures and Algorithms coursework to provide an interactive understanding of recursion, divide-and-conquer strategies, and exponential-time algorithm behavior.