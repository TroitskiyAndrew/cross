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
