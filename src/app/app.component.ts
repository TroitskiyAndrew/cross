import { Component } from '@angular/core';

type Player = 'X' | 'O';
type Outcomes = { wins: number; total: number };

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  board: (Player | null)[] = Array(9).fill(null);
  currentPlayer: Player = 'X';
  winningLine: number[] = [];
  winner: Player | null = null;
  private readonly probabilityCache = new Map<string, Outcomes>();

  winProbability(index: number): string | null {
    if (this.isFinished || this.board[index] !== null) return null;
    const nextBoard = [...this.board];
    nextBoard[index] = this.currentPlayer;
    const nextPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    if (WINNING_LINES.some(line => line.every(i => nextBoard[i] === this.currentPlayer))) {
      return '100.0';
    }
    const opponentCanWin = WINNING_LINES.some(line =>
      line.filter(i => nextBoard[i] === nextPlayer).length === 2 &&
      line.some(i => nextBoard[i] === null)
    );
    if (opponentCanWin) return '0.0';
    const outcomes = this.countOutcomes(nextBoard, nextPlayer, this.currentPlayer);
    return (100 * outcomes.wins / outcomes.total).toFixed(1);
  }

  // Count every legal move sequence once, stopping at the first win or draw.
  // Cached subtrees are added for each path reaching them, not deduplicated.
  private countOutcomes(board: (Player | null)[], turn: Player, target: Player): Outcomes {
    const key = board.map(cell => cell ?? '-').join('') + turn + target;
    const cached = this.probabilityCache.get(key);
    if (cached !== undefined) return cached;

    const line = WINNING_LINES.find(indices =>
      board[indices[0]] !== null && indices.every(i => board[i] === board[indices[0]])
    );
    if (line) return { wins: board[line[0]] === target ? 1 : 0, total: 1 };
    const empty = board.flatMap((cell, i) => cell === null ? [i] : []);
    if (empty.length === 0) return { wins: 0, total: 1 };

    const outcomes = empty.reduce<Outcomes>((sum, index) => {
      const next = [...board];
      next[index] = turn;
      const child = this.countOutcomes(next, turn === 'X' ? 'O' : 'X', target);
      return { wins: sum.wins + child.wins, total: sum.total + child.total };
    }, { wins: 0, total: 0 });
    this.probabilityCache.set(key, outcomes);
    return outcomes;
  }

  get isDraw(): boolean {
    if (this.winner) return false;
    return this.countOutcomes(this.board, this.currentPlayer, 'X').wins === 0 &&
      this.countOutcomes(this.board, this.currentPlayer, 'O').wins === 0;
  }

  get isFinished(): boolean {
    return this.winner !== null || this.isDraw;
  }

  get status(): string {
    if (this.winner) return `Победили ${this.winner === 'X' ? 'крестики' : 'нолики'}!`;
    if (this.isDraw) return 'Ничья! Сыграем ещё?';
    return `Ходят ${this.currentPlayer === 'X' ? 'крестики' : 'нолики'}`;
  }

  handleCellClick(index: number): void {
    if (this.isFinished || this.board[index] !== null) return;
    this.board[index] = this.currentPlayer;
    const line = WINNING_LINES.find(indices =>
      indices.every(i => this.board[i] === this.currentPlayer)
    );
    if (line) {
      this.winningLine = line;
      this.winner = this.currentPlayer;
    } else {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
  }

  rowNumber(index: number): number {
    return Math.floor(index / 3) + 1;
  }

  restart(): void {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.winningLine = [];
  }
}
