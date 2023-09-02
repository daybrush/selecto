import {
    previewFunction, previewTemplate, raw, DEFAULT_PROPS_TEMPLATE, CODE_TYPE,
    DEFAULT_VANILLA_CODESANDBOX, DEFAULT_REACT_CODESANDBOX, DEFAULT_PREACT_CODESANDBOX,
    DEFAULT_ANGULAR_CODESANDBOX, codeIndent, DEFAULT_VUE_CODESANDBOX, DEFAULT_LIT_CODESANDBOX,
    convertGlobalCSS, DEFAULT_SVELTE_CODESANDBOX,
} from "storybook-addon-preview";
import { IObject } from "@daybrush/utils";
import {
    REACT_SELCTO_TEMPLATE, AGULAR_HTML_SELCTO_TEMPLATE,
    VUE_HTML_SELCTO_TEMPLATE, CSS_TEMPLATE, LIT_HTML_SELCTO_TEMPLATE, SVELTE_SELCTO_TEMPLATE,
} from "./SelectoTemlate";

export const SCROLL_EVENT_TEMPLATE = previewFunction(`function onScroll(e) {
    //react scrollerRef.current.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
    //angular this.scroller.nativeElement.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
    //vue this.$refs.scroller.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
    //lit scroller.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
    //-react-angular-vue-lit scroller.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
}`);

export const SCROLL_HTML_TEMPLATE = previewTemplate`
<div class="app">
    <div class="container">
        <div class="logo" id="logo">
            <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
        </div>
        <h1>${raw("title")}</h1>
        <p class="description">${raw("description")}</p>
        <button class="button reset">Reset Scroll</button>
        <div class="elements scroll selecto-area">
        </div>
    </div>
</div>`;

export const SCROLL_VANILLA_TEMPLATE = (props: any[], events: object) => previewTemplate`
import Selecto from "selecto";

const container = document.querySelector(".container");
const scroller = document.querySelector(".scroll");
const cubes: number[] = [];

for (let i = 0; i < 30 * 7; ++i) {
    cubes.push(i);
}
container.querySelector(".selecto-area").innerHTML
    = cubes.map(i => ${"`"}<div class="cube"></div>${"`"}).join("");
const selecto = new Selecto({
    container,
    dragContainer: ".elements",
${DEFAULT_PROPS_TEMPLATE(props, { indent: 4 })}
    scrollOptions: {
        container: scroller,
        throttleTime: ${"Scroll's throttleTime"},
        threshold: ${"Scroll's threshold"},
    },
});

selecto${Object.keys(events).map(name => `.on("${name}", ${events[name](CODE_TYPE.ARROW, "vanilla")})`).join("")};

scroller.addEventListener("scroll", () => {
    selecto.checkScroll();
});
document.querySelector(".reset").addEventListener("click", () => {
    scroller.scrollTo(0, 0);
});
`;

export const SCROLL_REACT_TEMPLATE = (props: any[], events: IObject<any>, isPreact?: boolean) => previewTemplate`
${isPreact ? `
import { h } from "preact";
import Selecto from "preact-selecto";
` : `
import * as React from "react";
import Selecto from "react-selecto";
`}

export default function App() {
    const [scrollOptions, setScrollOptions] = React.useState({});
    const selectoRef = React.useRef(null);
    const scrollerRef = React.useRef(null);
    const cubes = [];

    for (let i = 0; i < 30 * 7; ++i) {
        cubes.push(i);
    }

    React.useEffect(() => {
        setScrollOptions({
            container: scrollerRef.current,
            throttleTime: ${"Scroll's throttleTime"},
            threshold: ${"Scroll's threshold"},
        });
    }, []);


    return <div className="app">
        <div className="container">
            <div className="logo" id="logo">
                <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
            </div>
            <h1>${raw("title")}</h1>
            <p className="description">${raw("description")}</p>
            <button className="button reset" onClick={() => {
                scrollerRef.current.scrollTo(0, 0);
            }}>Reset Scroll</button>
${REACT_SELCTO_TEMPLATE([...props, "scrollOptions"], events, "                ref={selectoRef}\n")}
            <div className="elements scroll selecto-area" id="selecto1" ref={scrollerRef} onScroll={() => {
                selectoRef.current.checkScroll();
            }}>
                {cubes.map(i => <div className="cube" key={i}></div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}`;

export const SCROLL_ANGULAR_HTML_TEMPLATE = (props: any[], events: any[]) => previewTemplate`
<div class="app">
    <div class="container">
        <div class="logo" id="logo">
            <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
        </div>
        <h1>${raw("title")}</h1>
        <p class="description">${raw("description")}</p>
        <button class="button reset" (click)="resetScroll()">Reset Scroll</button>
${AGULAR_HTML_SELCTO_TEMPLATE([...props, "scrollOptions"], events, "            #selecto\n")}
        <div class="elements scroll selecto-area" id="selecto1" #scroller (scroll)="onScrollerScroll()">
            <div class="cube" *ngFor="let num of cubes"></div>
        </div>
    </div>
</div>`;

export const SCROLL_ANGULAR_COMPONENT_TEMPLATE = (
    events: any[],
) => previewTemplate`
import { Component, ViewChild, OnInit, AfterViewInit } from "@angular/core";
import { NgxSelectoComponent } from "ngx-selecto";

@Component({
    selector: 'app-root',
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild('scroller', { static: false }) scroller: ElementRef;
    @ViewChild('selcto', { static: false }) selecto: NgxSelectoComponent;
    cubes = [];
    scrollOptions = {};
    ngOnInit() {
        const cubes = [];

        for (let i = 0; i < 30 * 7; ++i) {
            cubes.push(i);
        }
        this.cubes = cubes;
    }
    ngAfterViewInit() {
        this.scrollOptions = {
            container: this.scroller.nativeElement,
            throttleTime: ${"Scroll's throttleTime"},
            threshold: ${"Scroll's threshold"},
        };
    }
    resetScroll() {
        this.scroller.nativeElement.scrollTo(0, 0);
    }
    onScrollerScroll() {
        this.selecto.checkScroll();
    }
    ${events.map(e => codeIndent(e(CODE_TYPE.METHOD, "angular"), { indent: 4 })).join("\n    ")}
}
`;
export const SCROLL_ANGULAR_MODULE_TEMPLATE = `
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

export const SCROLL_VUE_TEMPLATE = (props: any[], eventNames: any[], events: any[]) => previewTemplate`
<template>
    <div class="app">
        <div class="container">
            <div class="logo" id="logo">
                <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
            </div>
            <h1>${raw("title")}</h1>
            <p class="description">${raw("description")}</p>
            <button class="button reset" @click="resetScroll">Reset Scroll</button>
${VUE_HTML_SELCTO_TEMPLATE([...props, "scrollOptions"], eventNames, `                ref="selecto"\n`)}
            <div class="elements scroll selecto-area" id="selecto1" ref="scroller" @scroll="onScrollerScroll">
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

        for (let i = 0; i < 30 * 7; ++i) {
            cubes.push(i);
        }
        return {
            cubes,
            scrollOptions: {},
        };
    },
    methods: {
        ${events.map(e => codeIndent(e(CODE_TYPE.METHOD, "vue"), { indent: 8 })).join(",\n        ")},
        resetScroll() {
            this.$refs.scroller.scrollTo(0, 0);
        },
        onScrollerScroll() {
            this.$refs.selecto.checkScroll();
        },
    },
    mounted() {
        this.scrollOptions = {
            container: this.$refs.scroller,
            throttleTime: ${"Scroll's throttleTime"},
            threshold: ${"Scroll's threshold"},
        };
    }
};
</script>`;

export const SCROLL_LIT_TEMPLATE = (props: any[], eventNames: any[], events: any[]) => previewTemplate`
import { html, render } from "lit-html";
import "lit-selecto";

const cubes = [];

for (let i = 0; i < 30 * 7; ++i) {
    cubes.push(i);
}
let scroller;

render(html${"`"}
    <div class="app">
        <div class="container">
            <div class="logo" id="logo">
                <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
            </div>
            <h1>${raw("title")}</h1>
            <p class="description">${raw("description")}</p>
            <button class="button reset" @click=${"$"}{() => {
                scroller.scrollTo(0, 0);
            }}>Reset Scroll</button>
${LIT_HTML_SELCTO_TEMPLATE(props, eventNames, events)}
            <div class="elements scroll cubes selecto-area" id="selecto1" @scroll=${"$"}{() => {
                selecto.checkScroll();
            }}>
                ${"$"}{cubes.map(() => html${"`"}<div class="cube"></div>${"`"})}
            </div>
            <div class="empty elements"></div>
        </div>
    </div>${"`"}, document.querySelector("#app"));

const selecto = document.querySelector("lit-selecto");
scroller = document.querySelector(".elements");

selecto.scrollOptions = {
    container: scroller,
    throttleTime: ${"Scroll's throttleTime"},
    threshold: ${"Scroll's threshold"},
};
`;

export const SCROLL_SVELTE_SCRIPT_TEMPLATE = previewTemplate`
<script>
import { onMount } from "svelte";
import Selecto from "svelte-selecto";


const cubes = [];

for (let i = 0; i < 30 * 7; ++i) {
    cubes.push(i);
}
let scrollOptions;
let scroller;
let selecto;

onMount(() => {
    scrollOptions = {
        container: scroller,
        throttleTime: ${"Scroll's throttleTime"},
        threshold: ${"Scroll's threshold"},
    };
});
</script>
<style>
    ${codeIndent(convertGlobalCSS(CSS_TEMPLATE, [
    "li.selected strong",
    ".selected a",
    ".selected",
]), { indent: 4 })}
</style>
`;
export const SCROLL_SVELTE_JSX_TEMPLATE = (props: any[], events: IObject<any>) => previewTemplate`
<div class="app">
    <div class="container">
        <div class="logo" id="logo">
            <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
        </div>
        <h1>${raw("title")}</h1>
        <p class="description">${raw("description")}</p>
        <button class="button reset" on:click={() => {
            scroller.scrollTo(0, 0);
        }}>Reset Scroll</button>
${SVELTE_SELCTO_TEMPLATE([...props, "scrollOptions"], events, "            bind:this={selecto}\n")}
        <div class="elements scroll cubes selecto-area" id="selecto1" bind:this={scroller} on:scroll={() => {
            selecto.checkScroll();
        }}>
            {#each cubes as cube}
                <div class="cube"></div>
            {/each}
        </div>
        <div class="empty elements"></div>
    </div>
</div>
`;

export const SCROLL_PREVIEWS_TEMPLATE = (props: any[], events: IObject<any>) => {
    const keys = Object.keys(events);
    const values = keys.map(key => events[key]);

    return [
        {
            tab: "Vanilla",
            template: SCROLL_VANILLA_TEMPLATE(props, events),
            language: "js",
            codesandbox: DEFAULT_VANILLA_CODESANDBOX(["selecto"]),
        },
        {
            tab: "React",
            template: SCROLL_REACT_TEMPLATE(props, events),
            language: "jsx",
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-selecto"]),
        },
        {
            tab: "Preact",
            template: SCROLL_REACT_TEMPLATE(props, events, true),
            language: "jsx",
            codesandbox: DEFAULT_PREACT_CODESANDBOX(["preact-selecto"]),
        },
        {
            tab: "Angular",
            description: "app.component.html",
            template: SCROLL_ANGULAR_HTML_TEMPLATE(props, keys),
            language: "markup",
            codesandbox: DEFAULT_ANGULAR_CODESANDBOX(["ngx-selecto"]),
        },
        {
            tab: "Angular",
            description: "app.component.ts",
            template: SCROLL_ANGULAR_COMPONENT_TEMPLATE(values),
            language: "ts",
            codesandbox: DEFAULT_ANGULAR_CODESANDBOX(["ngx-selecto"]),
        },
        {
            tab: "Angular",
            description: "app.component.ts",
            template: SCROLL_ANGULAR_MODULE_TEMPLATE,
            language: "ts",
            codesandbox: DEFAULT_ANGULAR_CODESANDBOX(["ngx-selecto"]),
        },
        {
            tab: "Vue",
            template: SCROLL_VUE_TEMPLATE(props, keys, values),
            language: "html",
            codesandbox: DEFAULT_VUE_CODESANDBOX(["vue-selecto"]),
        },
        {
            tab: "Lit",
            template: SCROLL_LIT_TEMPLATE(props, keys, values),
            language: "ts",
            codesandbox: DEFAULT_LIT_CODESANDBOX(["lit-selecto"]),
        },
        {
            tab: "Svelte",
            template: SCROLL_SVELTE_SCRIPT_TEMPLATE,
            language: "html",
            codesandbox: DEFAULT_SVELTE_CODESANDBOX(["svelte-selecto"]),
        },
        {
            continue: true,
            tab: "Svelte",
            template: SCROLL_SVELTE_JSX_TEMPLATE(props, events),
            language: "tsx",
            codesandbox: DEFAULT_SVELTE_CODESANDBOX(["svelte-selecto"]),
        },
    ];
};
