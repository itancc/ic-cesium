<script setup lang="ts">
import { componentHook } from "./hook";

const [, EComponent] = componentHook();
</script>

<template>
  <div class="repl-container">
    <component :is="EComponent"></component>
  </div>
</template>

<style scoped>
.repl-container {
  width: 100%;
  height: calc(
    100vh - var(--vp-nav-height) - var(--vt-banner-height, 0px) - 8px
  ) !important;
}
</style>
