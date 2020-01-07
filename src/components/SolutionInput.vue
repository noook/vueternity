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
    const valid = computed(() => {
      // eslint-disable-next-line
      const lines = props.input.split("\n");
      if (lines.length !== 16) return false;
      const rows = lines.map(row => row.split('-'));

      return rows.every(row => row.every((box) => {
        if (box === 'X') return true;
        return (new RegExp(/^\d{1,3}\(\d\)$/)).test(box);
      }));
    });

    const update = (e: Event) => {
      emit('update:input', (e.target as HTMLTextAreaElement).value);
    };
    return {
      update,
      valid,
    };
  },
});
</script>

<style lang="scss" scoped>
.solution-input {}
</style>
