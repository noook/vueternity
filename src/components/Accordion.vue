<template>
  <article class="accordion">
    <header @click="toggleAccordion">
      <slot name="header" />
      <div class="toggle" :class="{open}" />
    </header>
    <div class="content" ref="content" :class="{open}">
      <slot />
    </div>
  </article>
</template>

<script lang="ts">
import {
  createComponent, ref, watch, onMounted,
} from '@vue/composition-api';

interface Props {
  open: boolean;
}

export default createComponent<Props>({
  props: {
    open: {
      type: Boolean,
    },
  },
  setup(props: Props, { emit }) {
    const content = ref<HTMLDivElement>(null);
    const toggleAccordion = () => {
      emit('update:open', !props.open);
    };

    onMounted(() => {
      watch(() => props.open, (newV) => {
        if (newV === true) {
          content.value!.style.maxHeight = `${content.value?.scrollHeight}px`;
        } else {
          content.value!.style.maxHeight = '0px';
        }
      });
    });

    return {
      toggleAccordion,
      content,
    };
  },
});
</script>

<style lang="scss" scoped>
.accordion {
  border: solid 1px $flamingo;
  border-radius: 5px;

  header {
    @include d-flex-centered(space-between);
    background-color: $flamingo;
    min-height: 30px;
    color: #fff;
    font-size: .5em;
    text-align: left;
    padding: 5px 10px;
    cursor: pointer;

    .toggle {
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid #fff;
      transition: transform .3s;

      &.open {
        transform: rotate(180deg);
      }
    }
  }

  .content {
    max-height: 0;
    // margin: 0;
    overflow: hidden;
    font-size: .5em;
    transition: all .2s ease-in;

    &.open {
      max-height: 1000px;
    }
  }
}
</style>
