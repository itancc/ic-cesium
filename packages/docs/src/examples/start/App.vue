<script setup lang="ts">
import { Engine } from "@ic-cesium/engine";
import { Cartesian3 } from "cesium";
import { onMounted, shallowRef } from "vue";

const engineContainer = shallowRef();
onMounted(() => {
  const engine = new Engine({
    container: engineContainer.value,
    enableTerrain: true,
  });
  engine.flyToSpherBounding({
    position: Cartesian3.fromDegrees(106.551478, 29.608857, 2000),
    radius: 50,
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
