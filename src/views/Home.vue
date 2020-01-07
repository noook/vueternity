<template>
  <div class="home">
    <div class="board-container">
      <BoardComponent :input="input" />
      <SolutionInput :input.sync="input" />
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api';
import BoardComponent from '@/components/Board.vue';
import SolutionInput from '@/components/SolutionInput.vue';

export default createComponent({
  components: {
    BoardComponent,
    SolutionInput,
  },
  setup() {
    const input = ref<string>('');
    return {
      input,
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
