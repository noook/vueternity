<template>
  <nav>
    <div class="menu" @click="modalVisible(true)">
      <div class="hamburger" />
    </div>
    <div class="overlay" :class="{ visible: toggled }">
      <button class="close" @click="modalVisible(false)">&times;</button>
      <ul>
        <li @click="modalVisible(false)">
          <!-- <router-link to="/">Item</router-link> -->
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api';

export default createComponent({
  setup() {
    const toggled = ref<boolean>(false);
    const modalVisible = (visible: boolean) => {
      toggled.value = visible;
    };

    return {
      toggled,
      modalVisible,
    };
  },
});
</script>

<style lang="scss" scoped>
nav {
  padding: 10px;
  background-color: $flamingo;

  .menu {
    position: relative;
    width: 35px;
    height: 25px;
    @include d-flex-centered(center);

    .hamburger {
      height: 4px;
      width: 100%;
      background-color: #fff;
      border-radius: 10px;

      &:after, &:before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        height: 4px;
        border-radius: 10px;
        background-color: #fff;
      }

      &:before {
        top: 0;
      }

      &:after {
        bottom: 0;
      }
    }
  }

  .overlay {
    opacity: 0;
    z-index: -5;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $flamingo;
    transition: all .3s;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &.visible {
      opacity: 1;
      z-index: 30;
    }

    .close {
      position: absolute;
      display: block;
      top: 10px;
      right: 10px;
      border: none;
      background: none;
      font-size: 3em;
    }

    ul li a {
      font-size: 1.7em;
      color: #fff;
      text-decoration: none;
    }
  }
}
</style>
