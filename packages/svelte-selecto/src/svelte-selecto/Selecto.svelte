<script>
  import VanillaSelecto, {
    OPTIONS,
    PROPERTIES,
    EVENTS,
    CLASS_NAME,
  } from "selecto";

  import {
    onMount,
    onDestroy,
    createEventDispatcher,
    beforeUpdate,
  } from "svelte";

  const dispatch = createEventDispatcher();
  export let selecto;
  let el;

  beforeUpdate(() => {
    if (!selecto) {
      return;
    }

    PROPERTIES.forEach(name => {
      selecto[name] = $$props[name];
    });
  })
  onMount(() => {
    const options = [];

    OPTIONS.forEach(name => {
      if (name in $$props) {
        options[name] = $$props[name];
      }
    });
    selecto = new VanillaSelecto({
      ...options,
      target: el,
    });
     EVENTS.forEach((name, i) => {
      selecto.on(name, e => {
          const result = dispatch(name, e);

          if (result === false) {
              e.stop();
          }
      });
    });
  });
  onDestroy(() => {
    selecto.destroy();
  });
</script>
<div className={CLASS_NAME} bind:this={el}></div>;