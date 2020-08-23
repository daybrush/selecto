import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean, array } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import Selecto from "react-selecto";
import InfiniteViewer from "react-infinite-viewer";
import { SELECT_EVENT_TEMPLATE, CSS_TEMPLATE, DRAG_START_EVENT_TEMPLATE } from "../../template/SelectoTemlate";
import {
    SCROLL_HTML_TEMPLATE, SCROLL_EVENT_TEMPLATE, SCROLL_PREVIEWS_TEMPLATE
} from "../../template/InfiniteScrollTemplate";

const story = storiesOf("Selecto with Infinite Viewer", module).addDecorator(withKnobs).addDecorator(withPreview);

story.add("Select in the Infinite Scroll Viewer.", () => {
    return <App />;
}, {
    preview: [
        {
            tab: "HTML",
            template: SCROLL_HTML_TEMPLATE,
            language: "html",
            knobs: {
                title: `Select in the Infinite Scroll Viewer.`,
                description: `Selecting the scroll area area causes scrolling.`,
                selectableTargets: [".selecto-area .cube"],
            },
        },
        {
            tab: "CSS",
            template: CSS_TEMPLATE,
            language: "css",
        },
        ...SCROLL_PREVIEWS_TEMPLATE(
            ["selectableTargets", "hitRate", "selectByClick", "selectFromInside", "toggleContinueSelect", "ratio"],
            {
                dragStart: DRAG_START_EVENT_TEMPLATE,
                select: SELECT_EVENT_TEMPLATE,
                scroll: SCROLL_EVENT_TEMPLATE,
            },
        ),
    ],
});
function App() {
    const [scrollOptions, setScrollOptions] = React.useState({});
    const viewerRef = React.useRef<InfiniteViewer>(null);
    const cubes: number[] = [];

    for (let i = 0; i < 30 * 7; ++i) {
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
            <div className="logos logo" id="logo">
                <a href="https://github.com/daybrush/selecto" target="_blank"><img src="https://daybrush.com/selecto/images/256x256.png" className="selecto" /></a>
                <a href="https://github.com/daybrush/infinite-viewer" target="_blank"><img src="https://daybrush.com/infinite-viewer/images/logo.png" /></a>
            </div>
            <h1>Select in the Infinite Scroll Viewer.</h1>
            <p className="description">Selecting the scroll area area causes scrolling.</p>
            <button className="button" onClick={() => {
                viewerRef.current!.scrollTo(0, 0);
            }}>Reset Scroll</button>
            <Selecto
                dragContainer={".elements"}
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
                scrollOptions={{
                    ...scrollOptions,
                    throttleTime,
                    threshold,
                } as any}
                hitRate={number("hitRate", 100)}
                selectByClick={boolean("selectByClick", true)}
                selectFromInside={boolean("selectFromInside", true)}
                toggleContinueSelect={array("toggleContinueSelect", ["shift"])}
                ratio={number("ratio", 0)}
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
