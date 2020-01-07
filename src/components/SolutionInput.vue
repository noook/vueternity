<template>
  <div class="solution-input">
    <textarea
      :value="input"
      @input="update"
      name="solution-input"
      id="solution-input"
      :class="{valid}"
      cols="100"
      rows="20"></textarea>
    <ul class="errors">
      <li v-for="(err, i) in errors" :key="i">{{ err }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api';
import useBoardInput from '@/hooks/use-board-input';

interface Props {
  input: string;
}

export default createComponent<Props>({
  name: 'SolutionInput',
  props: {
    input: {
      type: String,
      required: true,
    },
  },
  setup(props: Props, { emit }) {
    const update = (e: Event) => {
      emit('update:input', (e.target as HTMLTextAreaElement).value);
    };
    return {
      update,
      ...useBoardInput(props),
    };
  },
});
</script>

<style lang="scss" scoped>
.solution-input {
  textarea {
    &:focus {
      box-shadow: inherit;
      outline: none;
      border: solid 1px #ccc;
    }
    border: solid 1px #ccc;
    box-shadow: 0 0 3px 1px #f00;

    &.valid {
      box-shadow: 0 0 3px 1px #0f0;
    }
  }

  ul {
    margin: 20px 0;
  }
}
</style>
