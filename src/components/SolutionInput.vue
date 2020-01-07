<template>
  <div class="solution-input">
    <textarea
      :value="input"
      @input="update"
      name="solution-input"
      id="solution-input"
      cols="100"
      rows="20"></textarea>
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
.solution-input {}
</style>
