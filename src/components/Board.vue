<template>
  <div class="board">
    <div class="row" v-for="(row, i) in board.boxes" :key="i">
      <img
        v-for="(box, j) in row"
        :key="j"
        class="piece"
        :src="`${assetsPath}/${box.piece.id}.png`" alt="">
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api';
import { Board } from '@/types/board';

interface Props {
  board: Board;
}

const assetsPath = `${window.location.origin}/assets`;

export default createComponent<Props>({
  props: {
    board: {
      type: Object as () => Board,
      required: true,
    },
  },
  setup(props: Props) {
    return {
      assetsPath,
    };
  },
});
</script>

<style lang="scss" scoped>
.board {
  margin: 20px;

  .row {
    display: grid;
    grid-template: 1fr / repeat(16, 1fr);
  }
}

img.piece {
  width: 40px;
  height: 40px;
}
</style>
