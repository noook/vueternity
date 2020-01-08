<template>
  <div class="history">
    <div class="container">
      <h1>history</h1>
      <BoardComponent :input="output" />
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent, ref, computed } from '@vue/composition-api';
import { cloneDeep } from 'lodash';
import BoardComponent from '@/components/Board.vue';
import { pieces as availablePieces } from '@/types/piece';
import { Board } from '../types/board';
import history from '@/assets/213.json';

export default createComponent({
  name: 'History',
  components: {
    BoardComponent,
  },
  setup() {
    const board = ref<Board>(new Board(16, 16));
    const output = computed(() => board.value.export());
    const pieces = cloneDeep(availablePieces);

    setInterval(() => {
      const action = history.shift();
      if (action !== undefined) {
        const piece = cloneDeep(pieces.find(p => p.id === action.piece.id)!);
        if (action.type === 'add') {
          piece.rotate(action.piece.rotation);
          board.value.setPiece(piece, action.piece.x, action.piece.y);
        } else {
          board.value.removePiece(action.piece.x, action.piece.y);
        }
      }
    }, 100);
    return {
      output,
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
h1 {
  font-size: 2em;
  margin: 20px 0;
}
</style>
