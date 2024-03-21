<script setup lang="ts">
import { Cartesian3 } from "cesium";
import { onMounted, shallowRef } from "vue";

const engineContainer = shallowRef();
onMounted(() => {});
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
