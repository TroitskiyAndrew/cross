import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('Tic-tac-toe', () => {
  let app: AppComponent;
  beforeEach(() => { app = new AppComponent(); });
  const play = (moves: number[]) => moves.forEach(i => app.handleCellClick(i));

  it('alternates players and ignores occupied cells', () => {
    play([0, 0]);
    expect(app.board[0]).toBe('X');
    expect(app.currentPlayer).toBe('O');
    play([1]);
    expect(app.board[1]).toBe('O');
    expect(app.currentPlayer).toBe('X');
  });

  const lines = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
  lines.forEach(line => {
    it(`detects a win on ${line}`, () => {
      const other = Array.from({ length: 9 }, (_, i) => i).filter(i => !line.includes(i));
      play([line[0], other[0], line[1], other[1], line[2]]);
      expect(app.winner).toBe('X');
      expect(app.winningLine).toEqual(line);
      const board = [...app.board];
      play([other[2]]);
      expect(app.board).toEqual(board);
    });
  });

  it('detects an O win', () => {
    play([0,3,1,4,8,5]);
    expect(app.winner).toBe('O');
  });

  it('detects a draw and resets the whole game', () => {
    play([0,1,2,4,3,5,7,6,8]);
    expect(app.isDraw).toBeTrue();
    expect(app.winner).toBeNull();
    app.restart();
    expect(app.board).toEqual(Array(9).fill(null));
    expect(app.currentPlayer).toBe('X');
    expect(app.isFinished).toBeFalse();
    expect(app.winningLine).toEqual([]);
  });

  it('prioritizes a last-move win over a draw and clears it on restart', () => {
    play([0,1,2,3,4,5,7,6,8]);
    expect(app.winner).toBe('X');
    expect(app.isDraw).toBeFalse();
    app.restart();
    expect(app.winner).toBeNull();
    expect(app.winningLine).toEqual([]);
    play([4]);
    expect(app.board[4]).toBe('X');
  });

  it('plays and restarts using the rendered buttons', async () => {
    await TestBed.configureTestingModule({ imports: [AppComponent] }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const cells = root.querySelectorAll<HTMLButtonElement>('.cell');
    expect(cells.length).toBe(9);
    cells[0].click();
    fixture.detectChanges();
    expect(cells[0].disabled).toBeTrue();
    expect(root.querySelector('[role="status"]')?.textContent).toContain('Ходят нолики');
    root.querySelector<HTMLButtonElement>('.restart')!.click();
    fixture.detectChanges();
    expect(cells[0].disabled).toBeFalse();
    expect(cells[0].textContent?.trim()).toBe('');
  });
});
