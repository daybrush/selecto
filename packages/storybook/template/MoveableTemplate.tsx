import {
    previewFunction, previewTemplate, raw, DEFAULT_PROPS_TEMPLATE, CODE_TYPE,
    DEFAULT_VANILLA_CODESANDBOX, DEFAULT_REACT_CODESANDBOX, DEFAULT_PREACT_CODESANDBOX,
    DEFAULT_ANGULAR_CODESANDBOX, codeIndent, DEFAULT_VUE_CODESANDBOX, DEFAULT_LIT_CODESANDBOX,
    convertGlobalCSS, DEFAULT_SVELTE_CODESANDBOX,
} from "storybook-addon-preview";
import { IObject, camelize } from "@daybrush/utils";
import {
    REACT_SELCTO_TEMPLATE, AGULAR_HTML_SELCTO_TEMPLATE,
    VUE_HTML_SELCTO_TEMPLATE, CSS_TEMPLATE, LIT_HTML_SELCTO_TEMPLATE, SVELTE_SELCTO_TEMPLATE,
} from "./SelectoTemlate";

export const MOVEABLE_CLICK_GROUP_TEMPLATE = previewFunction(`function onClickGroup(e) {
    //react selectoRef.current.clickTarget(e.inputEvent, e.inputTarget);
    //angular this.selecto.clickTarget(e.inputEvent, e.inputTarget);
    //vue this.$refs.selecto.clickTarget(e.inputEvent, e.inputTarget);
    //lit selecto.clickTarget(e.inputEvent, e.inputTarget);
    //-react-angular-vue-lit selecto.clickTarget(e.inputEvent, e.inputTarget);
}`);
export const MOVEABLE_DRAG_TEMPLATE = previewFunction(`function onDrag(e) {
    e.target.style.transform = e.transform;
}`);
export const MOVEABLE_DRAG_GROUP_TEMPLATE = previewFunction(`function onDragGroup(e) {
    e.events.forEach(ev => {
        ev.target.style.transform = ev.transform;
    });
}`);
export const SELECTO_DRAG_START_TEMPLATE = previewFunction(`function onDragStart(e) {
    //react const moveable = moveableRef.current;
    const target = e.inputEvent.target;
    if (
        //-vue this.moveable.isMoveableElement(target)
        //vue this.$refs.moveable.isMoveableElement(target)
        || this.targets.some(t => t === target || t.contains(target))
    ) {
        e.stop();
    }
}`);
export const SELECTO_SELECT_END_TEMPLATE = previewFunction(`function onSelectEnd(e) {
    //-react this.targets = e.selected;
    //vanilla this.moveable.target = this.targets;
    //react const moveable = moveableRef.current;
    //react setTargets(e.selected);

    if (e.isDragStart) {
        e.inputEvent.preventDefault();

        setTimeout(() => {
            //-angular-vue this.moveable.dragStart(e.inputEvent);
            //angular this.moveable.ngDragStart(e.inputEvent);
            //vue this.$refs.moveable.ngDragStart(e.inputEvent);
        });
    }
}`);
export const SELECTO_REAL_TIME_SELECT_TEMPLATE = previewFunction(`function onSelect(e) {
    //-react this.targets = e.selected;
    //vanilla this.moveable.target = this.targets;
    //react setTargets(e.selected);
}`);
export const SELECTO_REAL_TIME_SELECT_END_TEMPLATE = previewFunction(`function onSelectEnd(e) {
    //react const moveable = moveableRef.current;
    if (e.isDragStart) {
        e.inputEvent.preventDefault();

        setTimeout(() => {
            //-angular-vue this.moveable.dragStart(e.inputEvent);
            //angular this.moveable.ngDragStart(e.inputEvent);
            //vue this.$refs.moveable.dragStart(e.inputEvent);
        });
    }
}`);
export const MOVEABLE_HTML_TEMPLATE = previewTemplate`
<div class="moveable app">
    <div class="container">
        <div class="logo logos" id="logo">
            <a href="https://github.com/daybrush/selecto" target="_blank"><img src="https://daybrush.com/selecto/images/256x256.png" class="selecto" /></a>
            <a href="https://github.com/daybrush/moveable" target="_blank"><img src="https://daybrush.com/moveable/images/256x256.png" /></a>
        </div>
        <h1>${raw("title")}</h1>
        <p class="description">${raw("description")}</p>
        <div class="elements selecto-area"></div>
    </div>
</div>`;

export const MOVEABLE_VANILLA_TEMPLATE = (
    props: any[],
    moveableEvents: object,
    selectoEvents: object,
) => previewTemplate`
import Selecto from "selecto";
import Moveable from "moveable";

const container = document.querySelector(".container");
const cubes = [];
let targets = [];

for (let i = 0; i < 30; ++i) {
    cubes.push(i);
}
container.querySelector(".selecto-area").innerHTML
    = cubes.map(i => ${"`"}<div class="cube"></div>${"`"}).join("");
const selecto = new Selecto({
    container,
    dragContainer: ".elements",
${DEFAULT_PROPS_TEMPLATE(props, { indent: 4 })}
});
const moveable = new Moveable(container, {
    draggable: true,
})${Object.keys(moveableEvents).map(name => `.on("${name}", ${moveableEvents[name](CODE_TYPE.ARROW, "vanilla")})`).join("")};

selecto${Object.keys(selectoEvents).map(name => `.on("${name}", ${selectoEvents[name](CODE_TYPE.ARROW, "vanilla")})`).join("")};

`;

export const MOVEABLE_REACT_TEMPLATE = (
    props: any[],
    moveableEvents: IObject<any>,
    selectoEvents: IObject<any>,
    isPreact?: boolean,
) => previewTemplate`
${isPreact ? `
import { h } from "preact";
import Selecto from "preact-selecto";
import Moveable from "preact-moveable";
` : `
import * as React from "react";
import Selecto from "react-selecto";
import Moveable from "react-moveable";
`}

export default function App() {
    const cubes = Array.from({ length: 30 }, (_, i) => i);
    const [targets, setTargets] = React.useState([]);
    const moveableRef = React.useRef(null);
    const selectoRef = React.useRef(null);

    return <div className="moveable app">
        <div className="container">
            <div className="logo logos" id="logo">
                <a href="https://github.com/daybrush/selecto" target="_blank"><img src="https://daybrush.com/selecto/images/256x256.png" className="selecto" /></a>
                <a href="https://github.com/daybrush/moveable" target="_blank"><img src="https://daybrush.com/moveable/images/256x256.png" /></a>
            </div>
            <h1>${raw("title")}</h1>
            <p className="description">${raw("description")}</p>
            <Moveable
                ref={moveableRef}
                draggable={true}
                target={targets}
                ${Object.keys(moveableEvents).map(name => `${camelize(`on ${name}`)}={${codeIndent(moveableEvents[name](CODE_TYPE.ARROW, "react"), { indent: 16 })}}`).join("\n                ")}
            ></Moveable>
${REACT_SELCTO_TEMPLATE(props, selectoEvents, "                ref={selectoRef}\n")}
            <div className="elements selecto-area">
                {cubes.map(i => <div className="cube target" key={i}></div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}`;

export const MOVEABLE_VUE_TEMPLATE = (
    props: any[],
    moveableEvents: IObject<any>,
    selectoEvents: IObject<any>,
    isVue3?: boolean,
) => previewTemplate`
<template>
<div class="moveable app">
    <div class="container">
        <div class="logo logos" id="logo">
            <a href="https://github.com/daybrush/selecto" target="_blank"><img src="https://daybrush.com/selecto/images/256x256.png" class="selecto" /></a>
            <a href="https://github.com/daybrush/moveable" target="_blank"><img src="https://daybrush.com/moveable/images/256x256.png" /></a>
        </div>
        <h1>${raw("title")}</h1>
        <p class="description">${raw("description")}</p>
        <vue-moveable
            ref="moveable"
            v-bind:draggable="true"
            v-bind:target="targets"
            ${Object.keys(moveableEvents).map(name => `@${name}="${camelize(`on ${name === "dragStart" ? "moveableDragStart" : name}`)}"`).join("\n            ")}
        ></vue-moveable>
${VUE_HTML_SELCTO_TEMPLATE(props, Object.keys(selectoEvents), `            ref="selecto"\n`, { indent: 12 })}
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
import { VueMoveable } from "vue-moveable";
import { VueSelecto } from "vue-selecto";

export default {
    components: {
        VueMoveable,
        VueSelecto,
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
        ${Object.keys(moveableEvents).map(name => codeIndent(moveableEvents[name](CODE_TYPE.METHOD, "vue"), { indent: 8 })).join(",\n        ")},
        ${Object.keys(selectoEvents).map(name => codeIndent(selectoEvents[name](CODE_TYPE.METHOD, "vue"), { indent: 8 })).join(",\n        ")}
    },
};
</script>
`;

export const MOVEABLE_ANGULAR_HTML_TEMPLATE = (
    props: any[], moveableEvents: any[], selectoEvents: any[],
) => previewTemplate`
<div class="moveable app">
    <div class="container">
        <div class="logo logos" id="logo">
            <a href="https://github.com/daybrush/selecto" target="_blank"><img src="https://daybrush.com/selecto/images/256x256.png" class="selecto" /></a>
            <a href="https://github.com/daybrush/moveable" target="_blank"><img src="https://daybrush.com/moveable/images/256x256.png" /></a>
        </div>
        <h1>${raw("title")}</h1>
        <p class="description">${raw("description")}</p>
${AGULAR_HTML_SELCTO_TEMPLATE(props, selectoEvents, "            #selecto\n")}
        <ngx-moveable
            #moveable
            [draggable]='true'
            [target]='targets'
            ${moveableEvents.map(name => `(${name})="${camelize(`on ${name === "dragStart" ? "moveableDragStart" : name}`)}($event)"`).join("\n            ")}
        ></ngx-moveable>
        <div class="elements selecto-area" id="selecto1">
            <div class="cube" *ngFor="let num of cubes"></div>
        </div>
        <div class="empty elements"></div>
    </div>
</div>`;

export const MOVEABLE_ANGULAR_COMPONENT_TEMPLATE = (
    moveableEvents: any[],
    selectoEvents: any[],
) => previewTemplate`
import { Component, ViewChild, OnInit, AfterViewInit } from "@angular/core";
import { NgxMoveableComponent } from "ngx-moveable";
import { NgxSelectoComponent } from "ngx-selecto";

@Component({
    selector: 'app-root',
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild('moveable', { static: false }) moveable: NgxMoveableComponent;
    @ViewChild('selecto', { static: false }) selecto: NgxSelectoComponent;
    cubes = [];
    targets = [];
    ngOnInit() {
        const cubes = [];

        for (let i = 0; i < 30; ++i) {
            cubes.push(i);
        }
        this.cubes = cubes;
    }
    ${moveableEvents.map(e => codeIndent(e(CODE_TYPE.METHOD, "angular"), { indent: 4 })).join("\n    ")}
    ${selectoEvents.map(e => codeIndent(e(CODE_TYPE.METHOD, "angular"), { indent: 4 })).join("\n    ")}
}
`;
export const MOVEABLE_ANGULAR_MODULE_TEMPLATE = `
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { NgxSelectoModule } from "ngx-selecto";
import { NgxMoveableModule } from "ngx-moveable";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxSelectoModule, NgxMoveableModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}`;

export const MOVEABLE_SVELTE_SCRIPT_TEMPLATE = previewTemplate`
<script>
import { onMount } from "svelte";
import Selecto from "svelte-selecto";
import Moveable from "svelte-moveable";

const cubes = [];
let targets = [];
let moveable;
let selecto;

for (let i = 0; i < 30; ++i) {
    cubes.push(i);
}
</script>
<style>
    ${codeIndent(convertGlobalCSS(CSS_TEMPLATE, [
    "li.selected strong",
    ".selected a",
    ".infinite-viewer",
    ".selected",
]), { indent: 4 })}
</style>
`;
export const MOVEABLE_SVELTE_JSX_TEMPLATE = (
    props: any[], moveableEvents: IObject<any>, selectoEvents: IObject<any>,
) => previewTemplate`
<div class="moveable app">
    <div class="container">
        <div class="logo logos" id="logo">
            <a href="https://github.com/daybrush/selecto" target="_blank"><img src="https://daybrush.com/selecto/images/256x256.png" class="selecto" /></a>
            <a href="https://github.com/daybrush/moveable" target="_blank"><img src="https://daybrush.com/moveable/images/256x256.png" /></a>
        </div>
        <h1>${raw("title")}</h1>
        <p class="description">${raw("description")}</p>
        <Moveable
            bind:this={moveable}
            draggable={true}
            target={targets}
            ${Object.keys(moveableEvents).map((name, i) => `on:${name}={${codeIndent(moveableEvents[name](CODE_TYPE.CUSTOM_EVENT_ARROW, "svelte"), { indent: 12 })}}`).join("\n            ")}
        ></Moveable>
${SVELTE_SELCTO_TEMPLATE(props, selectoEvents, "            bind:this={selecto}\n")}
        <div class="elements selecto-area" id="selecto1">
            {#each cubes as cube}
                <div class="cube"></div>
            {/each}
        </div>
        <div class="empty elements"></div>
    </div>
</div>
`;

export const MOVEABLE_PREVIEWS_TEMPLATE = (props: any[], moveableEvents: IObject<any>, selectoEvents: IObject<any>) => {
    const moveableKeys = Object.keys(moveableEvents);
    const moveableValues = moveableKeys.map(key => moveableEvents[key]);
    const selectoKeys = Object.keys(selectoEvents);
    const selectoValues = selectoKeys.map(key => selectoEvents[key]);

    return [
        {
            tab: "Vanilla",
            template: MOVEABLE_VANILLA_TEMPLATE(props, moveableEvents, selectoEvents),
            language: "js",
            codesandbox: DEFAULT_VANILLA_CODESANDBOX(["selecto", "moveable"]),
        },
        {
            tab: "React",
            template: MOVEABLE_REACT_TEMPLATE(props, moveableEvents, selectoEvents),
            language: "jsx",
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-selecto", "react-moveable"]),
        },
        {
            tab: "Preact",
            template: MOVEABLE_REACT_TEMPLATE(props, moveableEvents, selectoEvents, true),
            language: "jsx",
            codesandbox: DEFAULT_PREACT_CODESANDBOX(["preact-selecto", "preact-moveable"]),
        },
        {
            tab: "Vue",
            template: MOVEABLE_VUE_TEMPLATE(props, moveableEvents, selectoEvents, true),
            language: "html",
            codesandbox: DEFAULT_VUE_CODESANDBOX(["vue-selecto", "vue-moveable@beta"]),
        },
        {
            tab: "Angular",
            description: "app.component.html",
            template: MOVEABLE_ANGULAR_HTML_TEMPLATE(props, moveableKeys, selectoKeys),
            language: "markup",
            codesandbox: DEFAULT_ANGULAR_CODESANDBOX(["ngx-selecto", "ngx-moveable"]),
        },
        {
            tab: "Angular",
            description: "app.component.ts",
            template: MOVEABLE_ANGULAR_COMPONENT_TEMPLATE(moveableValues, selectoValues),
            language: "ts",
            codesandbox: DEFAULT_ANGULAR_CODESANDBOX(["ngx-selecto", "ngx-moveable"]),
        },
        {
            tab: "Angular",
            description: "app.component.ts",
            template: MOVEABLE_ANGULAR_MODULE_TEMPLATE,
            language: "ts",
            codesandbox: DEFAULT_ANGULAR_CODESANDBOX(["ngx-selecto", "ngx-moveable"]),
        },
        // {
        //     tab: "Vue",
        //     template: MOVEABLE_VUE_TEMPLATE(props, keys, values),
        //     language: "html",
        //     codesandbox: DEFAULT_VUE_CODESANDBOX(["vue-selecto", "vue-moveable"]),
        // },
        // {
        //     tab: "Lit",
        //     template: MOVEABLE_LIT_TEMPLATE(props, keys, values),
        //     language: "ts",
        //     codesandbox: DEFAULT_LIT_CODESANDBOX(["lit-selecto", "lit-moveable"]),
        // },
        {
            tab: "Svelte",
            template: MOVEABLE_SVELTE_SCRIPT_TEMPLATE,
            language: "html",
            codesandbox: DEFAULT_SVELTE_CODESANDBOX(["svelte-selecto", "svelte-moveable"]),
        },
        {
            continue: true,
            tab: "Svelte",
            template: MOVEABLE_SVELTE_JSX_TEMPLATE(props, moveableEvents, selectoEvents),
            language: "tsx",
            codesandbox: DEFAULT_SVELTE_CODESANDBOX(["svelte-selecto", "svelte-moveable"]),
        },
    ];
};
