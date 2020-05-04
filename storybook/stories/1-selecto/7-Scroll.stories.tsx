import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean, array } from "@storybook/addon-knobs";
import { withPreview, DEFAULT_REACT_CODESANDBOX, previewTemplate, raw, DEFAULT_VANILLA_CODESANDBOX } from "storybook-addon-preview";
import Selecto from "react-selecto";
import InfiniteViewer from "react-infinite-viewer";
import { DragScrollOptions } from "@scena/dragscroll";
import { REACT_SELCTO_TEMPLATE, SELECT_EVENT_TEMPLATE, CSS_TEMPLATE } from "../../template/SelectoTemlate";
import { SCROLL_HTML_TEMPLATE, SCROLL_VANILLA_TEMPLATE, SCROLL_EVENT_TEMPLATE, SCROLL_OPTIONS_TEMPLATE } from "../../template/ScrollTemplate";

const story = storiesOf("Selecto", module).addDecorator(withKnobs).addDecorator(withPreview);

story.add("Select in the scroll area.", () => {
    return <App />;
}, {
    preview: [
        {
            tab: "HTML",
            template: SCROLL_HTML_TEMPLATE,
            language: "html",
            knobs: {
                title: `Select in the scroll area.`,
                description: `Selecting the scroll area area causes scrolling.`,
            },
        },
        {
            tab: "CSS",
            template: CSS_TEMPLATE,
            language: "css",
        },
        {
            tab: "Vanilla",
            codesandbox: DEFAULT_VANILLA_CODESANDBOX(["selecto", "infinite-viewer"]),
            template: SCROLL_VANILLA_TEMPLATE(
                ["hitRate", "selectByClick", "selectFromInside", "toggleContinueSelect"],
                {
                    select: SELECT_EVENT_TEMPLATE,
                    scroll: SCROLL_EVENT_TEMPLATE,
                },
            ),
            language: "js",
        },
        {
            tab: "React",
            template: previewTemplate`
import * as React from "react";
import Selecto from "react-selecto";
import InfiniteViewer from "react-infinite-viewer";

export default function App() {
    const [scrollOptions, setScrollOptions] = React.useState();
    const viewerRef = React.useRef(null);
    const cubes = [];

    for (let i = 0; i < 32 * 7; ++i) {
        cubes.push(i);
    }

    React.useEffect(() => {
        setScrollOptions({
            container: viewerRef.current.getElement(),
            getScrollPosition: () => {
                return [
                    viewerRef.current.getScrollLeft(),
                    viewerRef.current.getScrollTop(),
                ];
            },
        });
    }, []);

    const throttleTime = ${"Scroll's throttleTime"};
    const threshold = ${"Scroll's threshold"};

    return <div className="app">
        <div className="container">
            <div className="logo" id="logo">
                <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
            </div>
            <h1>${raw("title")}</h1>
            <p className="description">${raw("description")}</p>
            <button className="button" onClick={() => {
                viewerRef.current.scrollTo(0, 0);
            }}>Reset Scroll</button>
${REACT_SELCTO_TEMPLATE(["hitRate", "selectByClick", "selectFromInside", "toggleContinueSelect"], [SELECT_EVENT_TEMPLATE, SCROLL_EVENT_TEMPLATE, SCROLL_OPTIONS_TEMPLATE])}
            <InfiniteViewer className="elements infinite-viewer" ref={viewerRef}>
                <div className="viewport selecto-area" id="selecto1">
                    {cubes.map(i => <div className="cube" key={i}></div>)}
                </div>
            </InfiniteViewer>
            <div className="empty elements"></div>
        </div>
    </div>;
}`,
            language: "tsx",
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-selecto", "react-infinite-viewer"]),
        },
    ],
});
function App() {
    const [scrollOptions, setScrollOptions] = React.useState<DragScrollOptions>();
    const viewerRef = React.useRef<InfiniteViewer>(null);
    const cubes: number[] = [];

    for (let i = 0; i < 32 * 7; ++i) {
        cubes.push(i);
    }

    React.useEffect(() => {
        setScrollOptions({
            container: viewerRef.current!.getElement(),
            getScrollPosition: () => {
                return [
                    viewerRef.current!.getScrollLeft(),
                    viewerRef.current!.getScrollTop(),
                ];
            },
        });
    }, []);

    const throttleTime = number("Scroll's throttleTime", 30);
    const threshold = number("Scroll's threshold", 0);

    return <div className="app">
        <div className="container">
            <div className="logo" id="logo">
                <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
            </div>
            <h1>Select in the scroll area.</h1>
            <p className="description">Selecting the scroll area area causes scrolling.</p>
            <button className="button" onClick={() => {
                viewerRef.current!.scrollTo(0, 0);
            }}>Reset Scroll</button>
            <Selecto
                dragContainer={window}
                selectableTargets={["#selecto1 .cube", "#selecto2 .element", "#selecto3 li"]}
                onDragStart={e => {
                    if (e.inputEvent.target.nodeName === "BUTTON") {
                        return false;
                    }
                    return true;
                }}
                onSelect={e => {
                    e.added.forEach(el => {
                        el.classList.add("selected");
                    });
                    e.removed.forEach(el => {
                        el.classList.remove("selected");
                    });
                }}
                onScroll={({ direction }) => {
                    viewerRef.current!.scrollBy(direction[0] * 10, direction[1] * 10);
                }}
                scrollOptions={scrollOptions && {
                    ...scrollOptions,
                    throttleTime,
                    threshold,
                }}
                hitRate={number("hitRate", 100)}
                selectByClick={boolean("selectByClick", true)}
                selectFromInside={boolean("selectFromInside", true)}
                toggleContinueSelect={array("toggleContinueSelect", ["shift"])}
            ></Selecto>
            <InfiniteViewer className="elements infinite-viewer" ref={viewerRef}>
                <div className="viewport selecto-area" id="selecto1">
                    {cubes.map(i => <div className="cube" key={i}></div>)}
                </div>
            </InfiniteViewer>
            <div className="empty elements"></div>
        </div>
    </div>;
}
