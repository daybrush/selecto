<template>
  <div ref="selectoElement"></div>
</template>
<script lang="ts">
import VanillaSelecto, {
  SelectoOptions,
  OPTIONS,
  EVENTS,
  PROPERTIES,
  METHODS,
  SelectoMethods,
} from "selecto";
import { isUndefined } from "@daybrush/utils";
import { MethodInterface } from "framework-utils";
import { defineComponent } from "vue";
import { VueSelectoEvents } from "./types";

const methods: Record<string, any> = {};

METHODS.forEach((name) => {
  methods[name] = function (this: any, ...args: any[]) {
    return this.$_selecto[name](...args);
  };
});
const watch: Record<string, any> = {};

PROPERTIES.forEach((name) => {
  watch[name] = function (this: any, value: any) {
    return this.$_selecto[name] = value;
  };
});
const VueSelecto = defineComponent<
  Partial<SelectoOptions>,
  {},
  {},
  {},
  MethodInterface<SelectoMethods, VanillaSelecto, VueSelecto>,
  {},
  {},
  VueSelectoEvents
>({
  name: "selecto",
  methods: methods as any,
  props: OPTIONS as any,
  watch,
  mounted(this: any) {
    const props = this.$props;
    const options: Partial<SelectoOptions> = {};

    OPTIONS.forEach((name) => {
      const value = props[name];
      if (!isUndefined(value)) {
        (options as any)[name] = value;
      }
    });

    const selecto = new VanillaSelecto({
      ...options,
      portalContainer: this.$refs.selectoElement as any,
    });

    this.$_selecto = selecto;

    EVENTS.forEach((name) => {
      selecto.on(name, (e) => {
        this.$emit(name, { ...e });
      });
    });
  },
  beforeUnmount(this: any) {
    this.$_selecto.destroy();
  },
});
interface VueSelecto extends MethodInterface<SelectoMethods, VanillaSelecto, VueSelecto>, Partial<SelectoOptions>  {
  
}

export default VueSelecto;
</script>
