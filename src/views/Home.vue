<template>
  <div class="home">
    <div class="board-container">
      <BoardComponent :board="board" />
    </div>
    <pre>{{ board.export() }}</pre>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-await-in-loop */
import { cloneDeep } from 'lodash';
import { createComponent, ref, Ref } from '@vue/composition-api';
import BoardComponent from '@/components/Board.vue';
import { Board } from '@/types/board';
import Piece, { pieces as availblePieces } from '@/types/piece';
import { sleep, shuffle, partition } from '../utils';

// eslint-disable-next-line
// let [pieces, borders] = partition(shuffle(cloneDeep(availblePieces)), (piece: Piece) => !piece.isBorder());
const pieces = shuffle(cloneDeep(availblePieces));

export default createComponent({
  components: {
    BoardComponent,
  },
  setup() {
    const board = ref<Board>(new Board(16, 16));
    let solved = 0;
    const tried: number[] = [];

    function solve(b: Ref<Board>) {
      const box = b.value.closestEmptyCell(7, 8, tried);
      if (box === null) {
        return;
      }
      tried.push(box!.id);
      for (let i = 0; i < pieces.length; i += 1) {
        const assigned = b.value.assignPiece(box!, pieces[i]);
        if (assigned) {
          b.value.setPiece(pieces.splice(i, 1)[0], box!.x, box!.y);
          solved += 1;
          break;
        }
      }
      solve(b);
    }

    const middleIndex = pieces.findIndex(item => item.id === 139);
    board.value.setPiece(pieces.splice(middleIndex, 1)[0], 7, 8);
    solve(board);

    return {
      board,
    };
  },
});
</script>

<style lang="scss" scoped>
.board-container {
  display: flex;
  justify-content: center;
}

button {
  margin: 15px 0;
  position: relative;
  background-color: $flamingo;
  border: none;
  border-radius: 3px;
  color: #fff;
  font-size: 1.2rem;
  padding: 10px;
}

h1 {
  font-size: 2em;
}
</style>
