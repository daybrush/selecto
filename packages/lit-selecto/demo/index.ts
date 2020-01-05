import { html } from "lit-element";
import { render } from "lit-html";
import "../src/LitSelecto";

render(html`
<div class="button"> Shift </div>
<div class="target" style="top: 50px; left: 50px; width: 50px; height: 50px">T1</div>
<div class="target" style="top: 50px; left: 150px; width: 150px; height: 50px">T2</div>
<div class="target" style="top: 150px; left: 50px; width: 100px; height: 50px">T3</div>
<div class="target" style="top: 300px; left: 250px; width: 50px; height: 150px">T4</div>
<div class="target" style="top: 200px; left: 400px; width: 100px; height: 100px">T5</div>
<div class="target" style="top: 300px; left: 50px; width: 50px; height: 50px">T6</div>
<div class="target2" style="top: 330px; left: 80px; width: 120px; height: 120px">T7</div>

<lit-selecto
    .hitRate=${40}
    .selectableTargets=${[".target"]}
    .selectFromInside=${false}
    .selectByClick=${true}
    .toggleContinueSelect=${"shift"}
    @dragStart=${({ detail: e }) => {
        console.log("ds", e.inputEvent.target);
    }}
    @selectStart=${({ detail: e}) => {
        console.log("start", e);
        e.added.forEach(el => {
            el.classList.add("selected");
        });
        e.removed.forEach(el => {
            el.classList.remove("selected");
        });
    }}
    @selectEnd=${({ detail: e }) => {
        console.log("end", e);
        e.added.forEach(el => {
            el.classList.add("selected");
        });
        e.removed.forEach(el => {
            el.classList.remove("selected");
        });
    }}
    @keydown=${() => {
        document.querySelector(".button").classList.add("selected");
    }}
    @keyup=${() => {
        document.querySelector(".button").classList.remove("selected");
    }}></lit-selecto>`, document.body);
