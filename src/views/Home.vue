<template>
  <div class="home">
    <BoardComponent :board="board" />
  </div>
</template>

<script>
import { createComponent } from '@vue/composition-api';
import BoardComponent from '@/components/Board';
import { Board } from '@/types/board';

export default createComponent({
  components: {
    BoardComponent,
  },
  setup() {
    const board = new Board(16, 16);
    board.randomFill();
    return { board };
  },
});
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  justify-content: center;
}
h1 {
  font-size: 2em;
}
</style>
