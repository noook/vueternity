<template>
  <div class="home">
    <div class="board-container">
      <h1>Input</h1>
      <SolutionInput :input.sync="input" />
      <BoardComponent :input="input" />
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  margin: 20px 0;
}
</style>
