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
} from "selecto";
import { isUndefined } from "@daybrush/utils";

const methods: Record<string, any> = {};

METHODS.forEach((name) => {
  methods[name] = function(this: any, ...args: any[]) {
    this.$_selecto[name](...args);
  };
});
const watch: Record<string, any> = {};

PROPERTIES.forEach((name) => {
  watch[name] = function (this: any, value: any) {
    this.$_selecto[name] = value;
  };
});
export default {
  name: "selecto",
  methods,
  props: OPTIONS,
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
      target: this.$refs.target as any,
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
};
</script>
