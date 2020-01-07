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
import Piece, { pieces as availablePieces } from '@/types/piece';
import { sleep, shuffle, partition } from '../utils';

export default createComponent({
  components: {
    BoardComponent,
  },
  setup() {
    function test(): Board {
      // eslint-disable-next-line max-len
      const [pieces, borders] = partition(shuffle(cloneDeep(availablePieces)), (piece: Piece) => !piece.isBorder());
      const board = new Board(16, 16);
      const tried : number[] = [];

      const middleIndex = pieces.findIndex(item => item.id === 139);
      board.setPiece(pieces.splice(middleIndex, 1)[0], 7, 8);
      board.solve(pieces, tried);
      board.solveBorders(borders);
      return board;
    }

    return {
      board: test(),
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
