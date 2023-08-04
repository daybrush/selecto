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
    //react viewerRef.current.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
    //angular this.viewer.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
    //vue this.$refs.viewer.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
    //lit viewer.scrollByViewer(e.direction[0] * 10, e.direction[1] * 10);
    //-react-angular-vue-lit viewer.scrollBy(e.direction[0] * 10, e.direction[1] * 10);

}`);


export const SCROLL_HTML_TEMPLATE = previewTemplate`
<div class="app">
    <div class="container">
        <div class="logo logos"" id="logo">
            <a href="https://github.com/daybrush/selecto" target="_blank"><img src="https://daybrush.com/selecto/images/256x256.png" class="selecto" /></a>
            <a href="https://github.com/daybrush/infinite-viewer" target="_blank"><img src="https://daybrush.com/infinite-viewer/images/logo.png" /></a>
        </div>
        <h1>${raw("title")}</h1>
        <p class="description">${raw("description")}</p>
        <button class="button reset">Reset Scroll</button>
        <div class="elements infinite-viewer">
            <div class="viewport selecto-area">
            </div>
        </div>
    </div>
</div>`;

export const SCROLL_VANILLA_TEMPLATE = (props: any[], events: object) => previewTemplate`
import Selecto from "selecto";
import InfiniteViewer from "infinite-viewer";

const container = document.querySelector(".container");
const viewer = document.querySelector(".infinite-viewer");
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
        container: viewer,
        getScrollPosition: () => {
            return [
                infiniteViewer.getScrollLeft(),
                infiniteViewer.getScrollTop(),
            ];
        },
        throttleTime: ${"Scroll's throttleTime"},
        threshold: ${"Scroll's threshold"},
    },
});

selecto${Object.keys(events).map(name => `.on("${name}", ${events[name](CODE_TYPE.ARROW, "vanilla")})`).join("")};


const infiniteViewer = new InfiniteViewer(
    viewer,
    document.querySelector(".viewport"),
).on("scroll", () => {
    selecto.checkScroll();
});

document.querySelector(".reset").addEventListener("click", () => {
    infiniteViewer.scrollTo(0, 0);
});
`;

export const SCROLL_REACT_TEMPLATE = (props: any[], events: IObject<any>, isPreact?: boolean) => previewTemplate`
${isPreact ? `
import { h } from "preact";
import Selecto from "preact-selecto";
import InfiniteViewer from "preact-infinite-viewer";
` : `
import * as React from "react";
import Selecto from "react-selecto";
import InfiniteViewer from "react-infinite-viewer";
`}

export default function App() {
    const cubes = Array.from({ length: 210 }, (_, i) => i);
    const [scrollOptions, setScrollOptions] = React.useState({});
    const viewerRef = React.useRef(null);
    const selectoRef = React.useRef(null);
    const cubes = [];

    React.useEffect(() => {
        setScrollOptions({
            container: viewerRef.current.getElement(),
            getScrollPosition: () => {
                return [
                    viewerRef.current.getScrollLeft(),
                    viewerRef.current.getScrollTop(),
                ];
            },
            throttleTime: ${"Scroll's throttleTime"},
            threshold: ${"Scroll's threshold"},
        });
    }, []);

    return <div className="app">
        <div className="container">
            <div className="logo logos" id="logo">
                <a href="https://github.com/daybrush/selecto" target="_blank"><img src="https://daybrush.com/selecto/images/256x256.png" className="selecto" /></a>
                <a href="https://github.com/daybrush/infinite-viewer" target="_blank"><img src="https://daybrush.com/infinite-viewer/images/logo.png" /></a>
            </div>
            <h1>${raw("title")}</h1>
            <p className="description">${raw("description")}</p>
            <button className="button reset" onClick={() => {
                viewerRef.current.scrollTo(0, 0);
            }}>Reset Scroll</button>
${REACT_SELCTO_TEMPLATE([...props, "scrollOptions"], events, "                ref={selectoRef}\n")}
            <InfiniteViewer className="elements infinite-viewer" ref={viewerRef} onScroll={() => {
                selectoRef.current!.checkScroll();
            }}>
                <div className="viewport selecto-area" id="selecto1">
                    {cubes.map(i => <div className="cube" key={i}></div>)}
                </div>
            </InfiniteViewer>
            <div className="empty elements"></div>
        </div>
    </div>;
}`;

export const SCROLL_ANGULAR_HTML_TEMPLATE = (props: any[], events: any[]) => previewTemplate`
<div class="app">
    <div class="container">
        <div class="logo logos"" id="logo">
            <a href="https://github.com/daybrush/selecto" target="_blank"><img src="https://daybrush.com/selecto/images/256x256.png" class="selecto" /></a>
            <a href="https://github.com/daybrush/infinite-viewer" target="_blank"><img src="https://daybrush.com/infinite-viewer/images/logo.png" /></a>
        </div>
        <h1>${raw("title")}</h1>
        <p class="description">${raw("description")}</p>
        <button class="button reset" (click)="resetScroll()">Reset Scroll</button>
${AGULAR_HTML_SELCTO_TEMPLATE([...props, "scrollOptions"], events, "            #selecto\n")}
        <ngx-infinite-viewer class="elements infinite-viewer" #viewer (scroll)="onViewerScroll()">
            <div class="viewport selecto-area" id="selecto1">
                <div class="cube" *ngFor="let num of cubes"></div>
            </div>
        </ngx-infinite-viewer>
        <div class="empty elements"></div>
    </div>
</div>`;

export const SCROLL_ANGULAR_COMPONENT_TEMPLATE = (
    events: any[],
) => previewTemplate`
import { Component, ViewChild, OnInit, AfterViewInit } from "@angular/core";
import { NgxInfiniteViewerComponent } from "ngx-infinite-viewer";
import { NgxSelectoComponent } from "ngx-selecto";

@Component({
    selector: 'app-root',
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild('viewer', { static: false }) viewer: NgxInfiniteViewerComponent;
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
        const viewer = this.viewer;
        this.scrollOptions = {
            container: viewer.getContainer(),
            getScrollPosition: () => {
                return [
                    viewer.getScrollLeft(),
                    viewer.getScrollTop(),
                ];
            },
            throttleTime: ${"Scroll's throttleTime"},
            threshold: ${"Scroll's threshold"},
        };
    }
    onViewerScroll() {
        this.selecto.checkScroll();
    }
    resetScroll() {
        this.viewer.scrollTo(0, 0);
    }
    ${events.map(e => codeIndent(e(CODE_TYPE.METHOD, "angular"), { indent: 4 })).join("\n    ")}
}
`;
export const SCROLL_ANGULAR_MODULE_TEMPLATE = `
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { NgxSelectoModule } from "ngx-selecto";
import { NgxInfiniteViewerModule } from "ngx-infinite-viewer";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxSelectoModule, NgxInfiniteViewerModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}`;

export const SCROLL_VUE_TEMPLATE = (props: any[], eventNames: any[], events: any[]) => previewTemplate`
<template>
    <div class="app">
        <div class="container">
            <div class="logo logos"" id="logo">
                <a href="https://github.com/daybrush/selecto" target="_blank"><img src="https://daybrush.com/selecto/images/256x256.png" class="selecto" /></a>
                <a href="https://github.com/daybrush/infinite-viewer" target="_blank"><img src="https://daybrush.com/infinite-viewer/images/logo.png" /></a>
            </div>
            <h1>${raw("title")}</h1>
            <p class="description">${raw("description")}</p>
            <button class="button reset" @click="resetScroll">Reset Scroll</button>
${VUE_HTML_SELCTO_TEMPLATE([...props, "scrollOptions"], eventNames, `                ref="selecto"\n`)}
            <vue-infinite-viewer class="elements infinite-viewer" ref="viewer" @scroll="onViewerScroll">
                <div class="viewport selecto-area" id="selecto1">
                    <div class="cube" v-for="cube in cubes"></div>
                </div>
            </vue-infinite-viewer>
            <div class="empty elements"></div>
        </div>
    </div>
</template>
<style>
    ${codeIndent(CSS_TEMPLATE, { indent: 4 })}
</style>
<script>
import { VueSelecto } from "vue-selecto";
import { VueInfiniteViewer } from "vue-infinite-viewer";

export default {
    components: {
        VueSelecto,
        VueInfiniteViewer,
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
            this.$refs.viewer.scrollTo(0, 0);
        },
        onViewerScroll() {
            this.$refs.selecto.checkScroll();
        },
    },
    mounted() {
        const viewer = this.$refs.viewer;

        this.scrollOptions = {
            container: viewer.getContainer(),
            getScrollPosition: () => {
                return [
                    viewer.getScrollLeft(),
                    viewer.getScrollTop(),
                ];
            },
            throttleTime: ${"Scroll's throttleTime"},
            threshold: ${"Scroll's threshold"},
        };
    }
};
</script>`;

export const SCROLL_LIT_TEMPLATE = (props: any[], eventNames: any[], events: any[]) => previewTemplate`
import { html, render } from "lit-html";
import "lit-selecto";
import "lit-infinite-viewer";

const cubes = [];

for (let i = 0; i < 30 * 7; ++i) {
    cubes.push(i);
}
let viewer;

render(html${"`"}
    <div class="app">
        <div class="container">
            <div class="logo logos"" id="logo">
                <a href="https://github.com/daybrush/selecto" target="_blank"><img src="https://daybrush.com/selecto/images/256x256.png" class="selecto" /></a>
                <a href="https://github.com/daybrush/infinite-viewer" target="_blank"><img src="https://daybrush.com/infinite-viewer/images/logo.png" /></a>
            </div>
            <h1>${raw("title")}</h1>
            <p class="description">${raw("description")}</p>
            <button class="button reset" @click=${"$"}{() => {
                viewer.scrollToViewer(0, 0);
            }}>Reset Scroll</button>
${LIT_HTML_SELCTO_TEMPLATE(props, eventNames, events)}
            <lit-infinite-viewer class="elements infinite-viewer" @litScroll=${"$"}{() => {
                selecto.checkScroll();
            }}>
                <div class="cubes selecto-area" id="selecto1">
                    ${"$"}{cubes.map(() => html${"`"}<div class="cube"></div>${"`"})}
                </div>
            </lit-infinite-viewer>
            <div class="empty elements"></div>
        </div>
    </div>${"`"}, document.querySelector("#app"));

const selecto = document.querySelector("lit-selecto");
viewer = document.querySelector("lit-infinite-viewer");

selecto.scrollOptions = {
    container: viewer,
    getScrollPosition: () => {
        return [
            viewer.getScrollLeft(),
            viewer.getScrollTop(),
        ];
    },
    throttleTime: ${"Scroll's throttleTime"},
    threshold: ${"Scroll's threshold"},
};
`;

export const SCROLL_SVELTE_SCRIPT_TEMPLATE = previewTemplate`
<script>
import { onMount } from "svelte";
import Selecto from "svelte-selecto";
import InfiniteViewer from "svelte-infinite-viewer";


const cubes = [];

for (let i = 0; i < 30 * 7; ++i) {
    cubes.push(i);
}
let scrollOptions;
let viewer;
let selecto;

onMount(() => {
    scrollOptions = {
        container: viewer.getContainer(),
        getScrollPosition: () => {
            return [
                viewer.getScrollLeft(),
                viewer.getScrollTop(),
            ];
        },
        throttleTime: ${"Scroll's throttleTime"},
        threshold: ${"Scroll's threshold"},
    };
});
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
export const SCROLL_SVELTE_JSX_TEMPLATE = (props: any[], events: IObject<any>) => previewTemplate`
<div class="app">
    <div class="container">
        <div class="logo logos"" id="logo">
            <a href="https://github.com/daybrush/selecto" target="_blank"><img src="https://daybrush.com/selecto/images/256x256.png" class="selecto" /></a>
            <a href="https://github.com/daybrush/infinite-viewer" target="_blank"><img src="https://daybrush.com/infinite-viewer/images/logo.png" /></a>
        </div>
        <h1>${raw("title")}</h1>
        <p class="description">${raw("description")}</p>
        <button class="button reset" on:click={() => {
            viewer.scrollTo(0, 0);
        }}>Reset Scroll</button>
${SVELTE_SELCTO_TEMPLATE([...props, "scrollOptions"], events, "            bind:this={selecto}\n")}
        <InfiniteViewer class="elements infinite-viewer" bind:this={viewer} on:scroll={() => {
            selecto.checkScroll();
        }}>
            <div class="elements selecto-area" id="selecto1">
                {#each cubes as cube}
                    <div class="cube"></div>
                {/each}
            </div>
        </InfiniteViewer>
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
            codesandbox: DEFAULT_VANILLA_CODESANDBOX(["selecto", "infinite-viewer"]),
        },
        {
            tab: "React",
            template: SCROLL_REACT_TEMPLATE(props, events),
            language: "jsx",
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-selecto", "react-infinite-viewer"]),
        },
        {
            tab: "Preact",
            template: SCROLL_REACT_TEMPLATE(props, events, true),
            language: "jsx",
            codesandbox: DEFAULT_PREACT_CODESANDBOX(["preact-selecto", "preact-infinite-viewer"]),
        },
        {
            tab: "Angular",
            description: "app.component.html",
            template: SCROLL_ANGULAR_HTML_TEMPLATE(props, keys),
            language: "markup",
            codesandbox: DEFAULT_ANGULAR_CODESANDBOX(["ngx-selecto", "ngx-infinite-viewer"]),
        },
        {
            tab: "Angular",
            description: "app.component.ts",
            template: SCROLL_ANGULAR_COMPONENT_TEMPLATE(values),
            language: "ts",
            codesandbox: DEFAULT_ANGULAR_CODESANDBOX(["ngx-selecto", "ngx-infinite-viewer"]),
        },
        {
            tab: "Angular",
            description: "app.component.ts",
            template: SCROLL_ANGULAR_MODULE_TEMPLATE,
            language: "ts",
            codesandbox: DEFAULT_ANGULAR_CODESANDBOX(["ngx-selecto", "ngx-infinite-viewer"]),
        },
        {
            tab: "Vue",
            template: SCROLL_VUE_TEMPLATE(props, keys, values),
            language: "html",
            codesandbox: DEFAULT_VUE_CODESANDBOX(["vue-selecto", "vue-infinite-viewer"]),
        },
        {
            tab: "Lit",
            template: SCROLL_LIT_TEMPLATE(props, keys, values),
            language: "ts",
            codesandbox: DEFAULT_LIT_CODESANDBOX(["lit-selecto", "lit-infinite-viewer"]),
        },
        {
            tab: "Svelte",
            template: SCROLL_SVELTE_SCRIPT_TEMPLATE,
            language: "html",
            codesandbox: DEFAULT_SVELTE_CODESANDBOX(["svelte-selecto", "svelte-infinite-viewer"]),
        },
        {
            continue: true,
            tab: "Svelte",
            template: SCROLL_SVELTE_JSX_TEMPLATE(props, events),
            language: "tsx",
            codesandbox: DEFAULT_SVELTE_CODESANDBOX(["svelte-selecto", "svelte-infinite-viewer"]),
        },
    ];
};
