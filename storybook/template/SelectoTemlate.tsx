import { previewTemplate, JSX_PROPS_TEMPLATE, previewFunction, CODE_TYPE, codeIndent, raw, DEFAULT_PROPS_TEMPLATE, ANGULAR_PROPS_TEMPLATE, VUE_PROPS_TEMPLATE, LIT_PROPS_TEMPLATE, convertGlobalCSS } from "storybook-addon-preview";
import { camelize } from "@daybrush/utils";

import CSS_TEMPLATE from "!!raw-loader!./index.css";
export const HTML_TEMPLATE = previewTemplate`
<div class="app">
    <div class="container">
        <div class="logo" id="logo">
            <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
        </div>
        <h1>${raw("title")}</h1>
        <p class="description">${raw("description")}</p>
        <div class="elements selecto-area"></div>
    </div>
</div>
`;
export const SELECT_EVENT_TEMPLATE = previewFunction(`function onSelect(e) {
    e.added.forEach(el => {
        el.classList.add("selected");
    });
    e.removed.forEach(el => {
        el.classList.remove("selected");
    });
}`);

export const SELECT_START_EVENT_TEMPLATE = previewFunction(`function onSelectStart(e) {
    e.added.forEach(el => {
        el.classList.add("selected");
    });
    e.removed.forEach(el => {
        el.classList.remove("selected");
    });
}`);
export const SELECT_END_EVENT_TEMPLATE = previewFunction(`function onSelectEnd(e) {
    e.afterAdded.forEach(el => {
        el.classList.add("selected");
    });
    e.afterRemoved.forEach(el => {
        el.classList.remove("selected");
    });
}`);
export const SELECT_ONLY_END_EVENT_TEMPLATE = previewFunction(`function onSelectEnd(e) {
    e.added.forEach(el => {
        el.classList.add("selected");
    });
    e.removed.forEach(el => {
        el.classList.remove("selected");
    });
}`);

export const REACT_SELCTO_TEMPLATE = (props: string[], events: any[]) => previewTemplate`            <Selecto
                dragContainer={window}
                selectableTargets={[".selecto-area .cube"]}
                ${events.map(e => codeIndent(e(CODE_TYPE.REACT_ARROW, "react"), { indent: 16 })).join("\n                ")}
${JSX_PROPS_TEMPLATE(props, { indent: 16 })}
            ></Selecto>
`;
export const AGULAR_HTML_SELCTO_TEMPLATE = (props: string[], events: any[]) => previewTemplate`        <ngx-selecto
            dragContainer={window}
            selectableTargets={[".selecto-area .cube"]}
${ANGULAR_PROPS_TEMPLATE(props, { indent: 12 })}
            ${events.map(name => `@${name}="${camelize(`on ${name}`)}($event)"`).join("\n            ")}
        ></ngx-selecto>
`;

export const VUE_HTML_SELCTO_TEMPLATE = (props: string[], events: any[]) => previewTemplate`            <vue-selecto
                v-bind:dragContainer='window'
                v-bind:selectableTargets='[".selecto-area .cube"]'
${VUE_PROPS_TEMPLATE(props, { indent: 16 })}
                ${events.map(name => `@${name}="${camelize(`on ${name}`)}"`).join("\n            ")}
                ></vue-selecto>
`;
export const LIT_HTML_SELCTO_TEMPLATE = (props: string[], eventNames: any[], events: any[]) => previewTemplate`            <lit-selecto
                .dragContainer=${"$"}{window}
                .selectableTargets=${"$"}{[".selecto-area .cube"]}
${LIT_PROPS_TEMPLATE(props, { indent: 16 })}
                ${eventNames.map((name, i) => `@${camelize(`lit ${name}`)}=${"$"}{${codeIndent(events[i](CODE_TYPE.CUSTOM_EVENT_ARROW, "react"), { indent : 16 })}}`).join("\n            ")}
                ></lit-selecto>
`;
export const SVELTE_SELCTO_TEMPLATE = (props: string[], eventNames: any[], events: any[]) => previewTemplate`        <Selecto
            dragContainer={window}
            selectableTargets={[".selecto-area .cube"]}
${JSX_PROPS_TEMPLATE(props, { indent: 12 })}
            ${eventNames.map((name, i) => `on:${name}={${codeIndent(events[i](CODE_TYPE.CUSTOM_EVENT_ARROW, "svelte"), { indent: 12 })}}`).join("\n                ")}
        ></Selecto>
`;


export const VANILLA_TEMPLATE = (props: any[], events: object) => previewTemplate`
import Selecto from "selecto";

const container = document.querySelector(".container");
const cubes: number[] = [];

for (let i = 0; i < 64; ++i) {
    cubes.push(i);
}
container.querySelector(".selecto-area").innerHTML
    = cubes.map(i => ${"`"}<div class="cube"></div>${"`"}).join("");
const selecto = new Selecto({
    container,
    dragContainer: window,
    selectableTargets: [".selecto-area .cube"],
${DEFAULT_PROPS_TEMPLATE(props, { indent: 4 })},
});

selecto${Object.keys(events).map(name => `.on("${name}", ${events[name](CODE_TYPE.ARROW, "vanilla")})`).join("")};
`;

export const REACT_TEMPLATE = (props: any[], events: any[], isPreact?: boolean) => previewTemplate`
${isPreact ? `
import { h } from "preact";
import Selecto from "preact-selecto";
` : `
import * as React from "react";
import Selecto from "react-selecto";
`}
export default function App() {
    const cubes = [];

    for (let i = 0; i < 64; ++i) {
        cubes.push(i);
    }
    return <div className="app">
        <div className="container">
            <div className="logo" id="logo">
                <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
            </div>
            <h1>${raw("title")}</h1>
            <p className="description">${raw("description")}</p>
${REACT_SELCTO_TEMPLATE(props, events)}
            <div className="elements selecto-area" id="selecto1">
                {cubes.map(i => <div className="cube" key={i}></div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}`;

export const ANGULAR_HTML_TEMPLATE = (props: any[], events: any[]) => previewTemplate`
<div class="app">
    <div class="container">
        <div class="logo" id="logo">
            <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
        </div>
        <h1>${raw("title")}</h1>
        <p class="description">${raw("description")}</p>
${AGULAR_HTML_SELCTO_TEMPLATE(props, events)}
        <div class="elements selecto-area" id="selecto1">
            <div class="cube" *ngFor="let num of cubes"></div>
        </div>
        <div class="empty elements"></div>
    </div>
</div>`;


export const ANGULAR_COMPONENT_TEMPLATE = (
    events: any[],
) => previewTemplate`
import { Component, OnInit } from "@angular/core";
@Component({
    selector: 'app-root',
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
    cubes = [];
    ngOnInit() {
        const cubes = [];

        for (let i = 0; i < 64; ++i) {
            cubes.push(i);
        }
        this.cubes = cubes;
    }
    ${events.map(e => codeIndent(e(CODE_TYPE.METHOD, "react"), { indent: 4 })).join("\n    ")}
}
`;

export const ANGULAR_MODULE_TEMPLATE = `
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { NgxSelectoModule } from "ngx-selecto";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxSelectoModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}`;



export const VUE_TEMPLATE = (props: any[], eventNames: any[], events: any[]) => previewTemplate`
<template>
    <div class="app">
        <div class="container">
            <div class="logo" id="logo">
                <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
            </div>
            <h1>${raw("title")}</h1>
            <p class="description">${raw("description")}</p>
${VUE_HTML_SELCTO_TEMPLATE(props, eventNames)}
            <div class="elements selecto-area" id="selecto1">
                <div class="cube" v-for="cube in cubes"></div>
            </div>
            <div class="empty elements"></div>
        </div>
    </div>
</template>
<style>
    ${codeIndent(CSS_TEMPLATE, { indent: 4 })}
</style>
<script>
import { VueSelecto } from "vue-selecto";

export default {
    components: {
        VueSelecto,
    },
    data() {
        const cubes = [];

        for (let i = 0; i < 64; ++i) {
            cubes.push(i);
        }
        return {
            cubes,
            window,
        };
    },
    methods: {
        ${events.map(e => codeIndent(e(CODE_TYPE.METHOD, "vue"), { indent: 8 })).join("\n                ")}
    },
};
</script>`;



export const LIT_TEMPLATE = (props: any[], eventNames: any[], events: any[]) => previewTemplate`
import { html, render } from "lit-html";
import "lit-selecto";

const cubes = [];

for (let i = 0; i < 64; ++i) {
    cubes.push(i);
}
render(html${"`"}
    <div class="app">
        <div class="container">
            <div class="logo" id="logo">
                <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
            </div>
            <h1>${raw("title")}</h1>
            <p class="description">${raw("description")}</p>
${LIT_HTML_SELCTO_TEMPLATE(props, eventNames, events)}
            <div class="elements selecto-area" id="selecto1">
                ${"$"}{cubes.map(() => html${"`"}<div class="cube"></div>${"`"})}
            </div>
            <div class="empty elements"></div>
        </div>
    </div>${"`"}, document.querySelector("#app"));`;


export const SVELTE_SCRIPT_TEMPLATE = `
<script>
import Selecto from "svelte-selecto";


const cubes = [];

for (let i = 0; i < 64; ++i) {
    cubes.push(i);
}
</script>
<style>
    ${codeIndent(convertGlobalCSS(CSS_TEMPLATE, [
        "li.selected strong",
        ".selected a",
        ".selected"
    ]), { indent: 4 })}
</style>
`;
export const SVELTE_JSX_TEMPLATE = (props: any[], eventNames: any[], events: any[]) => previewTemplate`
<div class="app">
    <div class="container">
        <div class="logo" id="logo">
            <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
        </div>
        <h1>${raw("title")}</h1>
        <p class="description">${raw("description")}</p>
${SVELTE_SELCTO_TEMPLATE(props, eventNames, events)}
        <div class="elements selecto-area" id="selecto1">
            {#each cubes as cube}
                <div class="cube"></div>
            {/each}
        </div>
        <div class="empty elements"></div>
    </div>
</div>
`;
export { CSS_TEMPLATE };
