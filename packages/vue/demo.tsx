//@ts-nocheck
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const position = ref([1, 1, 1]);
    return () => (
      <Scene>
        <CubeMesh size={2} position={position}></CubeMesh>
        <Camera></Camera>
        <Light></Light>
        <Rain></Rain>
      </Scene>
    );
  },
});
