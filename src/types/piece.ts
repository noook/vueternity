// eslint-disable-next-line
import piecesReference from '!raw-loader!@/assets/pieces.txt';

interface PieceParams {
  id: number;
  top: number;
  bottom: number;
  right: number;
  left: number;
}

export default class Piece {
  public id: number;
  public rotation: number;
  public top: number;
  public bottom: number;
  public right: number;
  public left: number;

  public constructor(params: PieceParams) {
    this.id = params.id;
    this.rotation = 0;
    this.top = params.top;
    this.bottom = params.bottom;
    this.right = params.right;
    this.left = params.left;
  }

  public rotate(times: number) {
    const copy = (({ ...props }) => props)(this);

    this.top = copy.left;
    this.right = copy.top;
    this.bottom = copy.right;
    this.left = copy.bottom;
    this.rotation = (this.rotation + 1) % 4;

    if (times > 1) {
      this.rotate(times - 1);
    }
  }

  public isBorder(): boolean {
    return [this.top, this.left, this.right, this.bottom]
      .includes(0);
  }

  public isCorner(): boolean {
    return [this.top, this.left, this.right, this.bottom]
      .filter(side => side === 0).length > 1;
  }
}

export const pieces = (() => {
  const items: Piece[] = [];
  // eslint-disable-next-line
  const references = piecesReference.split("\n");

  return [...Array(references.length)]
    .map((_, index) => {
      const [top, bottom, left, right] = references[index]
        .split(' ')
        .map(el => parseInt(el, 10));

      return new Piece({
        id: index + 1,
        top,
        bottom,
        left,
        right,
      });
    });
})();
