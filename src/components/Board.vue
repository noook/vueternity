<template>
  <div class="board" v-if="valid">
    <div class="row" v-for="(row, i) in board.boxes" :key="i">
      <img
        v-for="(box, j) in row"
        :key="j"
        class="piece"
        :class="[`rotation-${box.piece.rotation}`]"
        :src="`${assetsPath}/${box.piece.id}.png`"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api';
import { Board } from '@/types/board';
import useBoardInput from '@/hooks/use-board-input';

interface Props {
  input: string;
}

const assetsPath = `${window.location.origin}/assets`;

export default createComponent<Props>({
  props: {
    input: {
      type: String,
      required: true,
    },
  },
  setup(props: Props) {
    const { board, valid } = useBoardInput(props);

    return {
      assetsPath,
      board,
      valid,
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

  &.rotation- {
    &1 {
      transform: rotate(90deg);
    }
    &2 {
      transform: rotate(180deg);
    }
    &3 {
      transform: rotate(270deg);
    }
  }
}
</style>
