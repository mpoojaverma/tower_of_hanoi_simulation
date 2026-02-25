class TowerOfHanoiSolver:
    def __init__(self):
        self.moves = []

    def solve(self, n):
        self.moves = []
        self._tower_of_hanoi(n, 0, 1, 2)
        return self.moves

    def _tower_of_hanoi(self, n, source, auxiliary, destination):
        if n == 1:
            self.moves.append((1, source, destination))
            return

        self._tower_of_hanoi(n - 1, source, destination, auxiliary)
        self.moves.append((n, source, destination))
        self._tower_of_hanoi(n - 1, auxiliary, source, destination)