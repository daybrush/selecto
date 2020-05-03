import { previewTemplate, JSX_PROPS_TEMPLATE, previewFunction, CODE_TYPE, codeIndent, raw, DEFAULT_PROPS_TEMPLATE } from "storybook-addon-preview";

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
export const SCROLL_EVENT_TEMPLATE = previewFunction(`function onScroll(e) {
    //react viewerRef.current.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
    //vanilla infiniteViewer.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
}`);

export const SCROLL_OPTIONS_TEMPLATE = ()  => `scrollOptions={scrollOptions && {
    ...scrollOptions,
    throttleTime,
    threshold,
}}`;

export const REACT_SELCTO_TEMPLATE = (props: string[], events: any[]) => previewTemplate`            <Selecto
                dragContainer={window}
                selectableTargets={[".selecto-area .cube"]}
                ${events.map(e => codeIndent(e(CODE_TYPE.REACT_ARROW, "react"), { indent: 16 })).join("\n                ")}
${JSX_PROPS_TEMPLATE(props, { indent: 16 })}
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

export const SCROLL_HTML_TEMPLATE = previewTemplate`
<div class="app">
    <div class="container">
        <div class="logo" id="logo">
            <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
        </div>
        <h1>${raw("title")}</h1>
        <p class="description">${raw("description")}</p>
        <button class="button">Reset Scroll</button>
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

for (let i = 0; i < 32 * 7; ++i) {
    cubes.push(i);
}
container.querySelector(".selecto-area").innerHTML
    = cubes.map(i => ${"`"}<div class="cube"></div>${"`"}).join("");
const selecto = new Selecto({
    container,
    dragContainer: window,
    selectableTargets: [".selecto-area .cube"],
${DEFAULT_PROPS_TEMPLATE(props, { indent: 4 })},
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
);
`;


export const REACT_TEMPLATE = (props: any[], events: any[]) => previewTemplate`
import * as React from "react";
import Selecto from "react-selecto";

export default function App() {
    const cubes: number[] = [];

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
