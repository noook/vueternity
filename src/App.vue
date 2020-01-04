<template>
  <div id="app">
    <Navbar />
    <router-view/>
  </div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api';
import Navbar from '@/components/Navbar.vue';

export default createComponent({
  components: {
    Navbar,
  },
  setup() {
    return {};
  },
});
</script>

<style>
@import '~@/assets/scss/reset.scss';
@import '~@/assets/scss/ui.scss';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
