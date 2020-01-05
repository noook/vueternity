// eslint-disable-next-line
import piecesReference from '!raw-loader!@/assets/pieces.txt';
import Piece from './piece';
import { shuffle, sleep } from '@/utils';

export class Box {
  public id: number;
  public piece: Piece;
  public x: number;
  public y: number;

  public constructor(id: number, x: number, y: number) {
    this.piece = new Piece({
      id: 0,
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
    });
    this.id = id;
    this.x = x;
    this.y = y;
  }

  public setPiece(piece: Piece): this {
    this.piece = piece;

    return this;
  }

  public isBorder(): boolean {
    return this.x === 0 || this.y === 0 || this.x === 15 || this.y === 15;
  }
}

export class Board {
  public boxes: Box[][] = [];
  public width: number;
  public height: number;

  public constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    let id = 1;

    for (let i = 0; i < height; i += 1) {
      const row: Box[] = [];

      for (let j = 0; j < width; j += 1) {
        row.push(new Box(id, j, i));
        id += 1;
      }
      this.boxes.push(row);
    }
  }

  public setPiece(piece: Piece, x: number, y: number): this {
    this.boxes[y][x].setPiece(piece);

    return this;
  }

  public closestEmptyCell(x: number, y: number, tried: number[]): Box | null {
    const maxRange = this.height > this.width ? this.height : this.width;

    for (let rangeInc = 1; rangeInc <= maxRange / 2; rangeInc += 1) {
      for (let i = -1 * rangeInc; i <= rangeInc; i += 1) {
        for (let j = -1 * rangeInc; j <= rangeInc; j += 1) {
          if (x + j < 0 || y + i < 0 || x + j > this.width || y + i > this.height) {
            continue;
          }

          if (!this.boxes[j + y][i + x]) {
            return null;
          }

          if (this.boxes[j + y][i + x].isBorder()) {
            continue;
          }

          if (this.boxes[j + y - 1][i + x].piece.id === 0
            && this.boxes[j + y + 1][i + x].piece.id === 0
            && this.boxes[j + y][i + x - 1].piece.id === 0
            && this.boxes[j + y][i + x + 1].piece.id === 0) {
            continue;
          }

          if (tried.includes(this.boxes[j + y][i + x].id)) {
            continue;
          }

          if (this.boxes[j + y][i + x].piece.id === 0) {
            return this.boxes[j + y][i + x];
          }
        }
      }
    }

    return null;
  }

  public assignPiece(box: Box, piece: Piece): boolean {
    const ok = {
      top: true,
      bottom: true,
      left: true,
      right: true,
    };

    for (let i = 0; i < 4; i += 1) {
      if (this.boxes[box.y - 1][box.x].piece.id !== 0) {
        ok.top = this.boxes[box.y - 1][box.x].piece.bottom === piece.top;
      }
      if (this.boxes[box.y + 1][box.x].piece.id !== 0) {
        ok.bottom = this.boxes[box.y + 1][box.x].piece.top === piece.bottom;
      }
      if (this.boxes[box.y][box.x - 1].piece.id !== 0) {
        ok.left = this.boxes[box.y][box.x - 1].piece.right === piece.left;
      }
      if (this.boxes[box.y][box.x + 1].piece.id !== 0) {
        ok.right = this.boxes[box.y][box.x + 1].piece.left === piece.right;
      }

      if (Object.values(ok).every(val => val === true)) {
        return true;
      }
      piece.rotate(1);
    }

    return false;
  }

  public export(): string {
    const output: string[] = [];

    this.boxes.forEach((row: Box[]) => {
      const outputRow: string[] = [];
      row.forEach((box: Box) => {
        if (box.piece.id === 0) {
          outputRow.push('X');
        } else {
          outputRow.push(`${box.piece.id}(${box.piece.rotation})`);
        }
      });
      output.push(outputRow.join('-'));
    });

    // eslint-disable-next-line
    return output.join("\n");
  }

  public reset() {
    this.boxes = [];
    let id = 1;

    for (let i = 0; i < this.height; i += 1) {
      const row: Box[] = [];

      for (let j = 0; j < this.width; j += 1) {
        row.push(new Box(id, j, i));
        id += 1;
      }
      this.boxes.push(row);
    }
  }

  public randomFill() {
    // eslint-disable-next-line
    const reference = piecesReference.split("\n");
    let pieces: Piece[] = [];

    for (let i = 0; i < 256; i += 1) {
      const [top, bottom, left, right] = reference[i]
        .split(' ')
        .map(el => parseInt(el, 10));

      pieces.push(new Piece({
        id: i + 1,
        top,
        bottom,
        left,
        right,
      }));
    }

    pieces = shuffle(pieces);

    for (let i = 0; i < this.height; i += 1) {
      for (let j = 0; j < this.width; j += 1) {
        this.setPiece(pieces.shift()!, j, i);
      }
    }
  }
}
