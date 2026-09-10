import { Component } from '@angular/core';

type Player = 'X' | 'O';

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
  private readonly probabilityCache = new Map<string, number>();

  winProbability(index: number): string | null {
    if (this.isFinished || this.board[index] !== null) return null;
    const nextBoard = [...this.board];
    nextBoard[index] = this.currentPlayer;
    const nextPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    return (100 * this.calculateProbability(nextBoard, nextPlayer, this.currentPlayer)).toFixed(1);
  }

  // Each available move is equally likely; terminal games stop immediately.
  private calculateProbability(board: (Player | null)[], turn: Player, target: Player): number {
    const key = board.map(cell => cell ?? '-').join('') + turn + target;
    const cached = this.probabilityCache.get(key);
    if (cached !== undefined) return cached;

    const line = WINNING_LINES.find(indices =>
      board[indices[0]] !== null && indices.every(i => board[i] === board[indices[0]])
    );
    if (line) return board[line[0]] === target ? 1 : 0;
    const empty = board.flatMap((cell, i) => cell === null ? [i] : []);
    if (empty.length === 0) return 0;

    const probability = empty.reduce((sum, index) => {
      const next = [...board];
      next[index] = turn;
      return sum + this.calculateProbability(next, turn === 'X' ? 'O' : 'X', target);
    }, 0) / empty.length;
    this.probabilityCache.set(key, probability);
    return probability;
  }

  get isDraw(): boolean {
    return !this.winner && this.board.every(cell => cell !== null);
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
    } else if (!this.isDraw) {
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
