import {
    previewTemplate, JSX_PROPS_TEMPLATE, previewFunction, CODE_TYPE,
    codeIndent, raw, DEFAULT_PROPS_TEMPLATE, ANGULAR_PROPS_TEMPLATE, VUE_PROPS_TEMPLATE,
    LIT_PROPS_TEMPLATE, convertGlobalCSS, DEFAULT_VANILLA_CODESANDBOX, DEFAULT_REACT_CODESANDBOX,
    DEFAULT_PREACT_CODESANDBOX, DEFAULT_ANGULAR_CODESANDBOX,
    DEFAULT_VUE_CODESANDBOX, DEFAULT_LIT_CODESANDBOX, DEFAULT_SVELTE_CODESANDBOX
} from "storybook-addon-preview";
import { camelize, IObject } from "@daybrush/utils";

import CSS_TEMPLATE from "!!raw-loader!./index.css";

export const HTML_TEMPLATE = previewTemplate`
<div class="app">
   <div class="container">
        <div class="logo" id="logo">
            <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
        </div>
        <h1>${raw("title")}</h1>
        <p class="description">${raw("description")}</p>
        <div class="elements correct">
            <div class="target" style="background: #e55">0</div>
            <div class="target" style="transform: rotate(45deg); background: #77dda5;">0</div>
            <div class="target" style="transform: skew(-30deg); background: #7799ee;">0</div>
            <svg>
                <path d=""></path>
            </svg>
        </div>
    </div>
</div>
`;

export const DRAW_PATH_TEMPLATE = previewFunction(`
function drawPath(e) {
    //react const svgElement = svgRef.current!;
    //react const pathElement = pathRef.current!;
    //angular const svgElement = this.svgRef.nativeElement;
    //angular const pathElement = this.pathRef.nativeElement;
    //vue const svgElement = this.$refs.svg;
    //vue const pathElement = this.$refs.path;
    const svgRect = svgElement.getBoundingClientRect();
    const targets = e.currentTarget.getSelectedTargets();

    pathElement.setAttribute("d", targets.map(target => {
        const rect = e.rect;
        const rectPoints = [
            [rect.left, rect.top],
            [rect.right, rect.top],
            [rect.right, rect.bottom],
            [rect.left, rect.bottom],
        ];

        const points = getOverlapPoints(
            e.currentTarget.getElementPoints(target),
            rectPoints,
        ).map(p => [p[0] - svgRect.left, p[1] - svgRect.top]);
        target.innerHTML = "" + Math.round(getAreaSize(points));

        return points.length ? ${"`"}M ${"$"}{points.join(", L")} Z${"`"} : "";
    }).join(" "));
}`);
export const DRAG_EVENT_TEMPLATE = previewFunction(`function onDrag(e) {
    this.drawPath(e);
}`);

export const SELECT_EVENT_TEMPLATE = previewFunction(`function onSelect(e) {
    e.removed.forEach(target => {
        target.innerHTML = "0";
    });
}`);

export const SELECT_START_EVENT_TEMPLATE = previewFunction(`function onSelectStart(e) {
    e.removed.forEach(target => {
        target.innerHTML = "0";
    });
    this.drawPath(e);
}`);

export const REACT_SELCTO_TEMPLATE = (props: string[], events: IObject<any>, otherTexts = "") => previewTemplate`            <Selecto
${otherTexts}                dragContainer={".container"}
                getElementRect={getElementInfo}
${JSX_PROPS_TEMPLATE(props, { indent: 16 })}
                ${Object.keys(events).map(name => `${camelize(`on ${name}`)}={${codeIndent(events[name](CODE_TYPE.ARROW, "react"), { indent: 16 })}}`).join("\n                ")}
            ></Selecto>
`;
export const AGULAR_HTML_SELCTO_TEMPLATE = (props: string[], events: any[], otherTexts = "") => previewTemplate`        <ngx-selecto
${otherTexts}            dragContainer=".container"
            [getElementRect]="getElementInfo"
${ANGULAR_PROPS_TEMPLATE(props, { indent: 12, wrap: "'" })}
            ${events.map(name => `(${name})="${camelize(`on ${name}`)}($event)"`).join("\n            ")}
        ></ngx-selecto>`;

export const VUE_HTML_SELCTO_TEMPLATE = (props: string[], events: any[]) => previewTemplate`            <vue-selecto
                dragContainer=".container"
                v-bind:getElementRect="getElementInfo"
${VUE_PROPS_TEMPLATE(props, { indent: 16, wrap: "'" })}
                ${events.map(name => `@${name}="${camelize(`on ${name}`)}"`).join("\n                ")}
                ></vue-selecto>
`;
export const LIT_HTML_SELCTO_TEMPLATE = (props: string[], eventNames: any[], events: any[]) => previewTemplate`            <lit-selecto
                .dragContainer=${"$"}{".container"}
                .getElementRect=${"$"}{getElementInfo}
${LIT_PROPS_TEMPLATE(props, { indent: 16 })}
                ${eventNames.map((name, i) => `@${camelize(`lit ${name}`)}=${"$"}{${codeIndent(events[i](CODE_TYPE.CUSTOM_EVENT_ARROW, "lit"), { indent: 16 })}}`).join("\n                ")}
                ></lit-selecto>
`;
export const SVELTE_SELCTO_TEMPLATE = (props: string[], events: IObject<any>, otherTexts = "") => previewTemplate`        <Selecto
${otherTexts}            dragContainer={".container"}
            getElementRect={getElementInfo}
${JSX_PROPS_TEMPLATE(props, { indent: 12 })}
            ${Object.keys(events).map((name, i) => `on:${name}={${codeIndent(events[name](CODE_TYPE.CUSTOM_EVENT_ARROW, "svelte"), { indent: 12 })}}`).join("\n            ")}
        ></Selecto>
`;

export const VANILLA_TEMPLATE = (props: any[], events: object) => previewTemplate`
import Selecto from "selecto";
import { getElementInfo } from "moveable";
import { getOverlapPoints, getAreaSize } from "overlap-area";

const container = document.querySelector(".container");
const svgElement = document.querySelector("svg");
const pathElement = svgElement.querySelector("path");

${DRAW_PATH_TEMPLATE(CODE_TYPE.FUNCTION, "vanilla")}
const selecto = new Selecto({
    container,
    dragContainer: ".container",
${DEFAULT_PROPS_TEMPLATE(props, { indent: 4 })}
});

selecto${Object.keys(events).map(name => `.on("${name}", ${events[name](CODE_TYPE.ARROW, "vanilla")})`).join("")};
`;

export const REACT_TEMPLATE = (props: any[], events: IObject<any>, isPreact?: boolean) => previewTemplate`
${isPreact ? `
import { h } from "preact";
import Selecto from "preact-selecto";
import { getElementInfo } from "preact-moveable";` : `
import * as React from "react";
import Selecto from "react-selecto";
import { getElementInfo } from "react-moveable";`}
import { getOverlapPoints, getAreaSize } from "overlap-area";


export default function App() {
    const svgRef = React.useRef(null);
    const pathRef = React.useRef(null);

    ${codeIndent(DRAW_PATH_TEMPLATE(CODE_TYPE.FUNCTION, "react"), { indent: 4 })}
    return <div className="app">
        <div className="container">
            <div className="logo" id="logo">
                <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
            </div>
            <h1>${raw("title")}</h1>
            <p className="description">${raw("description")}</p>
${REACT_SELCTO_TEMPLATE(props, events)}
            <div className="elements correct">
                <div className="target" style={{background: "#e55"}}>0</div>
                <div className="target" style={{transform: "rotate(45deg)", background: "#77dda5" }}>0</div>
                <div className="target" style={{transform: "skew(-30deg)", background: "#7799ee" }}>0</div>
                <svg ref={svgRef}>
                    <path d="" ref={pathRef}></path>
                </svg>
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
        <div class="elements correct">
            <div class="target" style="background: #e55">0</div>
            <div class="target" style="transform: rotate(45deg); background: #77dda5;">0</div>
            <div class="target" style="transform: skew(-30deg); background: #7799ee;">0</div>
            <svg #svg>
                <path d="" #path></path>
            </svg>
        </div>
        <div class="empty elements"></div>
    </div>
</div>`;

export const ANGULAR_COMPONENT_TEMPLATE = (
    events: any[],
) => previewTemplate`
import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { getElementInfo } from "moveable";
import { getOverlapPoints, getAreaSize } from "overlap-area";

@Component({
    selector: 'app-root',
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
    @ViewChild('svg', { static: false }) svgRef: ElementRef;
    @ViewChild('path', { static: false }) pathRef: ElementRef;
    getElementInfo = getElementInfo;
    ${codeIndent(DRAW_PATH_TEMPLATE(CODE_TYPE.METHOD, "angular"), { indent: 4 })}
    ${events.map(e => codeIndent(e(CODE_TYPE.METHOD, "angular"), { indent: 4 })).join("\n    ")}
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
            <div class="elements correct">
                <div class="target" style="background: #e55">0</div>
                <div class="target" style="transform: rotate(45deg); background: #77dda5;">0</div>
                <div class="target" style="transform: skew(-30deg); background: #7799ee;">0</div>
                <svg ref="svg">
                    <path d="" ref="path"></path>
                </svg>
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
import { getElementInfo } from "moveable";
import { getOverlapPoints, getAreaSize } from "overlap-area";

export default {
    components: {
        VueSelecto,
    },
    data() {
        return {
            getElementInfo,
        };
    },
    methods: {
        ${codeIndent(DRAW_PATH_TEMPLATE(CODE_TYPE.METHOD, "vue"), { indent: 8 })},
        ${events.map(e => codeIndent(e(CODE_TYPE.METHOD, "vue"), { indent: 8 })).join(",\n        ")}
    },
};
</script>`;

export const LIT_TEMPLATE = (props: any[], eventNames: any[], events: any[]) => previewTemplate`
import { html, render } from "lit-html";
import { getElementInfo } from "moveable";
import { getOverlapPoints, getAreaSize } from "overlap-area";
import "lit-selecto";

let svgElement;
let pathElement;
${DRAW_PATH_TEMPLATE(CODE_TYPE.FUNCTION, "")}

render(html${"`"}
    <div class="app">
        <div class="container">
            <div class="logo" id="logo">
                <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
            </div>
            <h1>${raw("title")}</h1>
            <p class="description">${raw("description")}</p>
${LIT_HTML_SELCTO_TEMPLATE(props, eventNames, events)}
            <div class="elements correct">
                <div class="target" style="background: #e55">0</div>
                <div class="target" style="transform: rotate(45deg); background: #77dda5;">0</div>
                <div class="target" style="transform: skew(-30deg); background: #7799ee;">0</div>
                <svg>
                    <path d=""></path>
                </svg>
            </div>
            <div class="empty elements"></div>
        </div>
    </div>${"`"},
    document.querySelector("#app"),
);
svgElement = document.querySelector("svg");
pathElement = svgElement.querySelector("path");

`;

export const SVELTE_SCRIPT_TEMPLATE = `
<script>
import Selecto from "svelte-selecto";
import { getElementInfo } from "moveable";
import { getOverlapPoints, getAreaSize } from "overlap-area";

let svgElement;
let pathElement;

${DRAW_PATH_TEMPLATE(CODE_TYPE.FUNCTION)}

</script>
<style>
    ${codeIndent(convertGlobalCSS(CSS_TEMPLATE, [
    "li.selected strong",
    ".selected a",
    ".selected",
]), { indent: 4 })}
</style>
`;
export const SVELTE_JSX_TEMPLATE = (props: any[], events: IObject<any>) => previewTemplate`
<div class="app">
    <div class="container">
        <div class="logo" id="logo">
            <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
        </div>
        <h1>${raw("title")}</h1>
        <p class="description">${raw("description")}</p>
${SVELTE_SELCTO_TEMPLATE(props, events)}
        <div class="elements correct">
            <div class="target" style="background: #e55">0</div>
            <div class="target" style="transform: rotate(45deg); background: #77dda5;">0</div>
            <div class="target" style="transform: skew(-30deg); background: #7799ee;">0</div>
            <svg bind:this={svgElement}>
                <path d="" bind:this={pathElement}></path>
            </svg>
        </div>
        <div class="empty elements"></div>
    </div>
</div>
`;
export { CSS_TEMPLATE };

export const PREVIEWS_TEMPLATE = (props: any[], events: IObject<any>) => {
    const keys = Object.keys(events);
    const values = keys.map(key => events[key]);

    return [
        {
            tab: "Vanilla",
            template: VANILLA_TEMPLATE(props, events),
            language: "js",
            codesandbox: DEFAULT_VANILLA_CODESANDBOX(["selecto", "moveable", "overlap-area"]),
        },
        {
            tab: "React",
            template: REACT_TEMPLATE(props, events),
            language: "jsx",
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-selecto", "react-moveable", "overlap-area"]),
        },
        {
            tab: "Preact",
            template: REACT_TEMPLATE(props, events, true),
            language: "jsx",
            codesandbox: DEFAULT_PREACT_CODESANDBOX(["preact-selecto", "preact-moveable", "overlap-area"]),
        },
        {
            tab: "Angular",
            description: "app.component.html",
            template: ANGULAR_HTML_TEMPLATE(props, keys),
            language: "markup",
            codesandbox: DEFAULT_ANGULAR_CODESANDBOX(["ngx-selecto", "moveable", "overlap-area"]),
        },
        {
            tab: "Angular",
            description: "app.component.ts",
            template: ANGULAR_COMPONENT_TEMPLATE(values),
            language: "ts",
            codesandbox: DEFAULT_ANGULAR_CODESANDBOX(["ngx-selecto", "moveable", "overlap-area"]),
        },
        {
            tab: "Angular",
            description: "app.component.ts",
            template: ANGULAR_MODULE_TEMPLATE,
            language: "ts",
            codesandbox: DEFAULT_ANGULAR_CODESANDBOX(["ngx-selecto", "moveable", "overlap-area"]),
        },
        {
            tab: "Vue",
            template: VUE_TEMPLATE(props, keys, values),
            language: "html",
            codesandbox: DEFAULT_VUE_CODESANDBOX(["vue-selecto", "moveable", "overlap-area"]),
        },
        {
            tab: "Lit",
            template: LIT_TEMPLATE(props, keys, values),
            language: "ts",
            codesandbox: DEFAULT_LIT_CODESANDBOX(["lit-selecto", "moveable", "overlap-area"]),
        },
        {
            tab: "Svelte",
            template: SVELTE_SCRIPT_TEMPLATE,
            language: "html",
            codesandbox: DEFAULT_SVELTE_CODESANDBOX(["svelte-selecto", "moveable", "overlap-area"]),
        },
        {
            continue: true,
            tab: "Svelte",
            template: SVELTE_JSX_TEMPLATE(props, events),
            language: "tsx",
            codesandbox: DEFAULT_SVELTE_CODESANDBOX(["svelte-selecto", "moveable", "overlap-area"]),
        },
    ];
};
