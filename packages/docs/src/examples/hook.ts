import { defineAsyncComponent, ref, shallowRef, watchEffect } from "vue";

const exampleModules = import.meta.glob("../examples/**/App.vue");
const exampleComponents = Object.entries(exampleModules).map(
  ([path, loader]) => {
    // get component name
    const name = path.replace("./", "").replace("/App.vue", "");
    return { name, loader };
  }
);

export const hashHook = () => {
  const hash = location.hash.slice(1) || "start";
  const hashState = ref(hash);
  window.addEventListener("hashchange", () => {
    const hash = location.hash.slice(1) || "start";
    hashState.value = hash;
  });

  return hashState;
};

export const componentHook = () => {
  const componentName = ref();
  const component = shallowRef();
  const hash = hashHook();
  watchEffect(() => {
    const comp = exampleComponents.find(
      (exampleComponent) => exampleComponent.name === hash.value
    );
    componentName.value = comp.name;
    component.value = defineAsyncComponent(comp.loader);
  });

  return [componentName, component];
};
