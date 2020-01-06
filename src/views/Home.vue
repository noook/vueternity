<template>
  <div class="home">
    <div class="board-container">
      <!-- <BoardComponent :board="board" /> -->
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-await-in-loop */
import { cloneDeep } from 'lodash';
import {
  createComponent, ref, Ref, computed,
} from '@vue/composition-api';
import BoardComponent from '@/components/Board.vue';
import { Board } from '@/types/board';
import Piece, { pieces as availblePieces } from '@/types/piece';
import { sleep, shuffle, partition } from '../utils';

// eslint-disable-next-line
let [pieces, borders] = partition(shuffle(cloneDeep(availblePieces)), (piece: Piece) => !piece.isBorder());
// const pieces = shuffle(cloneDeep(availblePieces));

export default createComponent({
  components: {
    BoardComponent,
  },
  setup() {
    return {
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
