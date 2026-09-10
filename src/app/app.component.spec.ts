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
    expect(cells[0].querySelector('[aria-hidden]')?.textContent?.trim()).toBe('');
  });

  it('shows 100 percent for an immediate win for either player', () => {
    play([0, 3, 1, 4]);
    expect(app.winProbability(2)).toBe('100.0');
    play([8]);
    expect(app.winProbability(5)).toBe('100.0');
  });

  it('counts winning continuations and leaves the current game untouched', () => {
    play([0, 1, 2, 3, 7, 4]);
    const before = [...app.board];
    // After X plays 5: O at 6 allows X to win at 8; O at 8 leads to a draw.
    expect(app.winProbability(5)).toBe('50.0');
    expect(app.board).toEqual(before);
    expect(app.currentPlayer).toBe('X');
    expect(app.winner).toBeNull();
  });

  it('counts a draw as zero and hides predictions after the game ends', () => {
    play([0, 1, 2, 4, 3, 5, 7, 6]);
    expect(app.winProbability(8)).toBe('0.0');
    expect(app.winProbability(0)).toBeNull();
    play([8]);
    expect(app.winProbability(8)).toBeNull();
    app.restart();
    expect(app.winProbability(8)).not.toBeNull();
    play([0, 3, 1, 4, 2]);
    expect(app.winProbability(8)).toBeNull();
  });

  it('weights completed sequences equally even when they have different lengths', () => {
    play([0, 3, 1, 4]);
    // After X at 6 there are 17 terminal sequences: 4 X wins, 5 O wins, 8 draws.
    // O at 5 ends immediately; other replies have multiple continuations.
    expect(app.winProbability(6)).toBe('23.5');
    expect(app.winProbability(6)).toBe('23.5');
  });

  it('attaches predictions to free buttons and updates them after a move', async () => {
    await TestBed.configureTestingModule({ imports: [AppComponent] }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const cells = root.querySelectorAll<HTMLButtonElement>('.cell');
    expect(root.querySelectorAll('.probability').length).toBe(9);
    expect(cells[0].getAttribute('aria-describedby')).toBe('probability-0');
    cells[0].click();
    fixture.detectChanges();
    expect(cells[0].querySelector('.probability')).toBeNull();
    expect(cells[0].hasAttribute('aria-describedby')).toBeFalse();
    expect(cells[1].querySelector('strong')?.textContent).toBe(fixture.componentInstance.winProbability(1) + '%');
  });
});
