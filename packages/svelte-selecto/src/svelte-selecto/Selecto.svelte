<script>
  import VanillaSelecto, {
    OPTIONS,
    PROPERTIES,
    EVENTS,
    CLASS_NAME
  } from "selecto";

  import {
    onMount,
    onDestroy,
    createEventDispatcher,
    beforeUpdate
  } from "svelte";

  const dispatch = createEventDispatcher();

  let selecto;
  let el;
  let options = {};

  export function getInstance() {
    return selecto;
  }

  beforeUpdate(() => {
    if (!selecto) {
      return;
    }
    const nextOptions = {};

    PROPERTIES.forEach(name => {
      nextOptions[name] = $$props[name];

      if (options[name] !== nextOptions[name]) {
        selecto[name] = nextOptions[name];
      }
    });

    options = nextOptions;
  });
  onMount(() => {
    OPTIONS.forEach(name => {
      if (name in $$props) {
        options[name] = $$props[name];
      }
    });

    
    selecto = new VanillaSelecto({
      ...options,
      target: el
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
    selecto && selecto.destroy();
  });
</script>

<div className={CLASS_NAME} bind:this={el} />
