import { previewFunction, previewTemplate, raw, DEFAULT_PROPS_TEMPLATE, CODE_TYPE } from "storybook-addon-preview";

export const SCROLL_EVENT_TEMPLATE = previewFunction(`function onScroll(e) {
    //react viewerRef.current.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
    //vanilla infiniteViewer.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
}`);

export const SCROLL_OPTIONS_TEMPLATE = ()  => `scrollOptions={scrollOptions && {
    ...scrollOptions,
    throttleTime,
    threshold,
}}`;


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
