<script setup lang="ts">
import { Engine, Scene } from "@ic-cesium/core";
import { Cartesian3 } from "cesium";
import { onMounted, shallowRef } from "vue";

const engineContainer = shallowRef();
onMounted(() => {
  const engine = new Engine(engineContainer.value);
  const scene = new Scene(engine, {
    enableTerrain: true,
    timeline: true,
    animation: true,
  });
  scene.flyToSpherBounding({
    position: Cartesian3.fromDegrees(106.551478, 29.608857, 2000),
    radius: 50,
  });

  return () => {
    engine.dispose();
    scene.dispose();
  };
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
