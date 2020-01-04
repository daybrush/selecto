import { html } from "lit-element";
import { render } from "lit-html";
import "../src/LitSelecto";

render(html`
<lit-selecto
    .hitRate=${40}
    .selectableTargets=${[".target"]}
    .selectFromInside=${false}
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
