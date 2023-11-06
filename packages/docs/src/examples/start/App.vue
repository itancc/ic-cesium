<script setup lang="ts">
import { Engine } from "@ic-cesium/engine";
import { onMounted, shallowRef } from "vue";

const engineContainer = shallowRef();
onMounted(() => {
  const engine = new Engine({
    container: engineContainer.value,
    enableTerrain: true,
  });
});
</script>

<template>
  <div ref="engineContainer" class="engine-container"></div>
</template>

<style scoped>
.engine-container {
  width: 100%;
  height: 100%;
}
</style>
