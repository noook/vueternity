import { cloneDeep } from 'lodash';
// eslint-disable-next-line
import piecesReference from '!raw-loader!@/assets/pieces.txt';
import Piece, { pieces as availablePieces } from './piece';
import { shuffle, partition } from '@/utils';

type EdgeBox = Box & {
  y: 0 | 15;
} & {
  x: 0 | 15;
}

type Position = 'top' | 'bottom' | 'left' | 'right';

const regex = /^(\d{1,3})\((\d)\)$/;

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

  public isCorner(): boolean {
    return [this.x === 0, this.y === 0, this.x === 15, this.y === 15]
      .filter(test => test === true).length > 1;
  }

  public isBorder(): this is EdgeBox {
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

  public solve(pieces: Piece[], tried: number[]) {
    const box = this.closestEmptyCell(7, 8, tried);
    if (box === null) {
      return;
    }
    tried.push(box!.id);

    for (let i = 0; i < pieces.length; i += 1) {
      const assigned = this.assignPiece(box, pieces[i]);

      if (assigned) {
        this.setPiece(pieces.splice(i, 1)[0], box.x, box.y);
        break;
      }
    }
    this.solve(pieces, tried);
  }

  public solveBorders(borders: Piece[]) {
    const [corners, edges] = partition(borders, piece => piece.isCorner());
    this.setCorners(shuffle(corners) as [Piece, Piece, Piece, Piece]);
    this.solveEdges(edges);
  }

  public setPiece(piece: Piece, x: number, y: number): this {
    this.boxes[y][x].setPiece(piece);

    return this;
  }

  get validBoxes(): number {
    return this.boxes.reduce((acc, row) => {
      acc += row.filter(box => box.piece.id !== 0).length;
      return acc;
    }, 0);
  }

  public setCorners(corners: [Piece, Piece, Piece, Piece]): this {
    const [topLeft, topRight, bottomLeft, bottomRight] = corners;
    while (!(topLeft.top === 0 && topLeft.left === 0)) {
      topLeft.rotate(1);
    }
    while (!(topRight.top === 0 && topRight.right === 0)) {
      topRight.rotate(1);
    }
    while (!(bottomLeft.bottom === 0 && bottomLeft.left === 0)) {
      bottomLeft.rotate(1);
    }
    while (!(bottomRight.bottom === 0 && bottomRight.right === 0)) {
      bottomRight.rotate(1);
    }
    this.setPiece(topLeft, 0, 0);
    this.setPiece(topRight, this.width - 1, 0);
    this.setPiece(bottomLeft, 0, this.height - 1);
    this.setPiece(bottomRight, this.width - 1, this.height - 1);

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
    if (box.isBorder()) {
      return this.assignEdge(box, piece);
    }
    const ok = {
      top: true,
      bottom: true,
      left: true,
      right: true,
    };

    for (let i = 0; i < 4; i += 1) {
      if (this.boxes[box.y - 1][box.x] && this.boxes[box.y - 1][box.x].piece.id !== 0) {
        ok.top = this.boxes[box.y - 1][box.x].piece.bottom === piece.top;
      }
      if (this.boxes[box.y + 1][box.x] && this.boxes[box.y + 1][box.x].piece.id !== 0) {
        ok.bottom = this.boxes[box.y + 1][box.x].piece.top === piece.bottom;
      }
      if (this.boxes[box.y][box.x - 1] && this.boxes[box.y][box.x - 1].piece.id !== 0) {
        ok.left = this.boxes[box.y][box.x - 1].piece.right === piece.left;
      }
      if (this.boxes[box.y][box.x + 1] && this.boxes[box.y][box.x + 1].piece.id !== 0) {
        ok.right = this.boxes[box.y][box.x + 1].piece.left === piece.right;
      }

      if (Object.values(ok).every(val => val === true)) {
        return true;
      }
      piece.rotate(1);
    }

    return false;
  }

  private getEdges(): EdgeBox[] {
    return this.boxes.reduce<EdgeBox[]>((acc, row) => {
      acc.push(...row.filter((box): box is EdgeBox => box.isBorder() && !box.isCorner()));
      return acc;
    }, []);
  }

  public solveEdges(borders: Piece[]) {
    const edges = this.getEdges();
    const tried: number[] = [];
    for (let i = 0; i < edges.length; i += 1) {
      const piece = this.tryEdge(edges[i], borders);
      if (piece !== null) {
        borders.splice(borders.findIndex(p => p.id === piece.id), 1);
      }
    }
  }

  private tryEdge(edge: EdgeBox, pieces: Piece[]): Piece | null {
    for (let i = 0; i < pieces.length; i += 1) {
      const assigned = this.assignEdge(edge, pieces[i]);
      if (assigned) {
        this.setPiece(pieces[i], edge.x, edge.y);
        return pieces[i];
      }
    }
    return null;
  }

  private assignEdge(box: EdgeBox, piece: Piece): boolean {
    const ok = {
      top: true,
      bottom: true,
      left: true,
      right: true,
    };
    let position!: Position;

    if (box.y === 0) {
      position = 'top';
    } else if (box.y === 15) {
      position = 'bottom';
    } else if (box.x === 0) {
      position = 'left';
    } else if (box.x === 15) {
      position = 'right';
    }

    while (piece[position] !== 0) {
      piece.rotate(1);
    }

    if (position !== 'top' && this.boxes[box.y - 1][box.x].piece.id !== 0) {
      ok.top = this.boxes[box.y - 1][box.x].piece.bottom === piece.top;
    }
    if (position !== 'bottom' && this.boxes[box.y + 1][box.x].piece.id !== 0) {
      ok.bottom = this.boxes[box.y + 1][box.x].piece.top === piece.bottom;
    }
    if (position !== 'left' && this.boxes[box.y][box.x - 1].piece.id !== 0) {
      ok.left = this.boxes[box.y][box.x - 1].piece.right === piece.left;
    }
    if (position !== 'right' && this.boxes[box.y][box.x + 1].piece.id !== 0) {
      ok.right = this.boxes[box.y][box.x + 1].piece.left === piece.right;
    }

    return Object.values(ok).every(val => val === true);
  }

  public export(): string {
    const output: string[] = [];

    this.boxes.forEach((row: Box[]) => {
      const outputRow: string[] = [];
      row.forEach((box: Box) => {
        if (box.piece.id === 0) {
          outputRow.push('X');
        } else {
          outputRow.push(`${box.piece.id - 1}(${box.piece.rotation})`);
        }
      });
      output.push(outputRow.join('-'));
    });

    // eslint-disable-next-line
    return output.join("\n");
  }

  // eslint-disable-next-line class-methods-use-this
  public import(input: string) {
    const emptyPiece = new Piece();
    const pieces = cloneDeep(availablePieces);
    // eslint-disable-next-line quotes
    const lines = input.split(/[\r\n]+/);
    lines.forEach((row, y) => {
      row.split('-').forEach((box, x) => {
        let piece: Piece;
        if (box.toUpperCase() === 'X') {
          piece = emptyPiece;
        } else {
          const [, id, rotation] = box.match(regex)!;
          piece = cloneDeep(pieces.find(p => parseInt(id, 10) + 1 === p.id)!);
          piece.rotate(parseInt(rotation, 10));
        }
        this.setPiece(piece, x, y);
      });
    });
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
