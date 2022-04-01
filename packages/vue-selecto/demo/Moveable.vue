<template>
  <div class="app">
    <div class="container">
      <vue-moveable
        ref="moveable"
        v-bind:target="targets"
        v-bind:draggable="true"
        @drag="onMoveableDrag"
      />
      <vue-selecto
        dragContainer=".elements"
        v-bind:selectableTargets="['.selecto-area .cube']"
        v-bind:hitRate="0"
        v-bind:selectByClick="true"
        v-bind:selectFromInside="false"
        v-bind:toggleContinueSelect="['shift']"
        v-bind:ratio="0"
        @dragStart="onDragStart"
        @selectEnd="onSelectEnd"
      ></vue-selecto>

      <div class="elements selecto-area" id="selecto1">
        <div class="cube" v-for="cube in cubes"></div>
      </div>
      <div class="empty elements"></div>
    </div>
  </div>
</template>
<style>
html,
body,
#root {
  position: relative;
  margin: 0;
  padding: 0;
  height: 100%;
  color: #333;
  background: #fdfdfd;
}

.app {
  position: relative;
  min-height: 100%;
  padding: 10px 20px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.container {
  max-width: 800px;
}

body {
  background: #fff;
}

.logo {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0px auto;
  font-size: 0;
  text-align: left;
}

.logo.logos {
  width: 320px;
  text-align: center;
}

.logos .selecto {
  padding: 16px;
}

.logo img {
  position: relative;
  height: 100%;
  box-sizing: border-box;
}

.cube {
  display: inline-block;
  border-radius: 5px;
  width: 40px;
  height: 40px;
  margin: 4px;
  background: #eee;
  --color: #4af;
}

h1,
.description {
  text-align: center;
}

.button {
  border: 1px solid #333;
  color: #333;
  background: transparent;
  appearance: none;
  -webkit-appearance: none;
  box-sizing: border-box;
  cursor: pointer;
  width: 120px;
  height: 42px;
  font-size: 14px;
  letter-spacing: 1px;
  transition: all ease 0.2s;
  margin: 0px 5px;
}

.button:hover {
  background: #333;
  color: white;
}

.elements {
  margin-top: 40px;
  border: 2px solid #eee;
}

.selecto-area {
  padding: 20px;
}

.moveable #selecto1 .cube {
  transition: none;
}

.selecto-area .selected {
  color: #fff;
  background: var(--color);
}

.scroll {
  overflow: auto;
  padding-top: 10px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.infinite-viewer,
.scroll {
  width: 100%;
  height: 300px;
  box-sizing: border-box;
}

.infinite-viewer .viewport {
  padding-top: 10px;
}

.empty.elements {
  border: none;
}
</style>
<script>
import { VueMoveable } from "vue-moveable";
import { VueSelecto } from "../src/index";

export default {
  components: {
    VueSelecto,
    VueMoveable,
  },
  data() {
    const cubes = [];

    for (let i = 0; i < 60; ++i) {
      cubes.push(i);
    }
    return {
      cubes,
      targets: [],
    };
  },
  methods: {
    onMoveableDrag(e) {
      console.log("TT");
      e.target.style.transform = e.transform;
    },
    onDragStart(e) {
      const moveable = this.$refs.moveable;
      const target = e.inputEvent.target;
      if (
        moveable.isMoveableElement(target) ||
        this.targets.some((t) => t === target || t.contains(target))
      ) {
        console.log("?");
        e.stop();
      }
    },
    onSelectEnd(e) {
      const moveable = this.$refs.moveable;
      this.targets = e.selected;

      if (e.isDragStart) {
        e.inputEvent.preventDefault();

        setTimeout(() => {
          moveable.$_moveable.innerMoveable.forceUpdate();
          moveable.dragStart(e.inputEvent);
        });
      }
    },
  },
};
</script>