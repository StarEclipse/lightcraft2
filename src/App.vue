<template>
  <RouterView />
  <StagewiseToolbar v-if="isDevelopment" :config="stagewiseConfig" />
</template>

<script setup>
import { computed } from 'vue';
import { StagewiseToolbar } from '@stagewise/toolbar-vue';
import { VuePlugin } from '@stagewise-plugins/vue';

const stagewiseConfig = {
  plugins: [VuePlugin],
};

const isDevelopment = computed(() => import.meta.env.DEV);
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
