import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  board: Array<'X' | 'O' | null> = Array(9).fill(null);
  currentPlayer: 'X' | 'O' = 'X';

  handleCellClick(index: number): void {
    if (this.board[index] !== null) {
      return;
    }

    this.board[index] = this.currentPlayer;
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }
}
