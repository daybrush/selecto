<template>
  <div class="container">
    <div class="button">Shift</div>
    <div class="target" style="top: 50px; left: 50px; width: 50px; height: 50px">T1</div>
    <div class="target" style="top: 50px; left: 150px; width: 150px; height: 50px">T2</div>
    <div class="target" style="top: 150px; left: 50px; width: 100px; height: 50px">T3</div>
    <div class="target" style="top: 300px; left: 250px; width: 50px; height: 150px">T4</div>
    <div class="target" style="top: 200px; left: 400px; width: 100px; height: 100px">T5</div>
    <div class="target" style="top: 300px; left: 50px; width: 50px; height: 50px">T6</div>
    <div class="target2" style="top: 330px; left: 80px; width: 120px; height: 120px">T7</div>
    <vue-selecto
      :selectableTargets="['.target']"
      :dragContainer="dragContainer"
      :hitRate="40"
      :selectFromInside="false"
      :selectByClick="true"
      :toggleContinueSelect="'shift'"
      @dragStart="onDragStart"
      @keydown="onKeydown"
      @keyup="onKeyup"
      @selectStart="onSelectStart"
      @selectEnd="onSelectEnd"
    />
  </div>
</template>
<style>
html,
body,
.container {
  position: relative;
  height: 100%;
  margin: 0;
  padding: 0;
}
.target,
.target2 {
  position: absolute;
  background: #faa;
  box-sizing: border-box;
}
.target.selected {
  border: 4px solid #f55;
}
.button {
  position: absolute;
  left: 500px;
  top: 50px;
  background: #eee;
  padding: 15px 40px;
  display: inline-block;
  border-radius: 5px;
  font-weight: bold;
  color: #444;
}
.button.selected {
  color: #fff;
  background: #66d;
}
</style>
<script>
import { VueSelecto } from "../src/index";
export default {
  components: {
    VueSelecto
  },
  data() {
      return {
          dragContainer: document.body,
      }
  },
  methods: {
    onDragStart(e) {
      console.log("ds", e.inputEvent.target);
    },
    onSelectStart(e) {
      console.log("start", e);
      e.added.forEach(el => {
        el.classList.add("selected");
      });
      e.removed.forEach(el => {
        el.classList.remove("selected");
      });
    },
    onSelectEnd(e) {
      console.log("end", e);
      e.afterAdded.forEach(el => {
        el.classList.add("selected");
      });
      e.afterRemoved.forEach(el => {
        el.classList.remove("selected");
      });
    },
    onKeydown() {
      console.log("keydown");
      document.querySelector(".button").classList.add("selected");
    },
    onKeyup() {
      console.log("keyup");
      document.querySelector(".button").classList.remove("selected");
    }
  }
};
</script>