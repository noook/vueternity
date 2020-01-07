import { computed } from '@vue/composition-api';
import { cloneDeep } from 'lodash';
import { Board } from '@/types/board';
import Piece, { pieces as availablePieces, emptyPiece } from '@/types/piece';

interface Props {
  input: string;
}

export default function useBoardInput(props: Props) {
  const valid = computed(() => {
    // eslint-disable-next-line
    const lines = props.input.split("\n");
    if (lines.length !== 16) return false;
    const rows = lines.map(row => row.split('-'));

    return rows.every(row => row.every((box) => {
      if (box.toUpperCase() === 'X') return true;
      return (new RegExp(/^\d{1,3}\(\d\)$/)).test(box);
    }));
  });

  const board = computed((): Board | null => {
    if (!valid.value) return null;
    const b = new Board(16, 16);
    const pieces = cloneDeep(availablePieces);
    const regex = /^(\d{1,3})\((\d)\)$/;

    // eslint-disable-next-line
    const lines = props.input.split("\n");
    const rows = lines.map(row => row.split('-'));
    for (let y = 0; y < rows.length; y += 1) {
      for (let x = 0; x < rows[y].length; x += 1) {
        const value = rows[y][x];
        let piece: Piece;
        if (value === 'X') {
          piece = emptyPiece;
        } else {
          const [, id, rotation] = value.match(regex)!;
          piece = pieces.find(p => p.id === parseInt(id, 10))!;
          piece.rotate(parseInt(rotation, 10));
        }
        b.setPiece(piece, x, y);
      }
    }

    return b;
  });

  return {
    board,
    valid,
  };
}
