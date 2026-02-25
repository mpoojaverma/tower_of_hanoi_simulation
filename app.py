import os

from flask import Flask, jsonify, render_template, request

from solver.hanoi_solver import TowerOfHanoiSolver

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/solve', methods=['POST'])
def solve_puzzle():
    try:
        data = request.get_json(silent=True) or {}
        n_disks = int(data.get('disks', 3))

        if not (3 <= n_disks <= 8):
            return jsonify({'error': 'Disks must be between 3 and 8'}), 400

        solver = TowerOfHanoiSolver()
        moves = solver.solve(n_disks)
        return jsonify({'moves': moves})

    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid input for disks'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)